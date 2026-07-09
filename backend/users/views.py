from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Address, Wishlist, AuditLog
from .serializers import UserSerializer, AddressSerializer, WishlistSerializer, AuditLogSerializer


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class LoginView(APIView):
    """Custom login: accepts email + password, returns JWT + user info."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')

        if not email or not password:
            return Response(
                {'detail': 'Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find user by email
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {'detail': 'No account found with this email.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check password directly (no authenticate() which needs username)
        if not user.check_password(password):
            return Response(
                {'detail': 'Incorrect password. Please try again.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.is_active:
            return Response(
                {'detail': 'This account has been disabled.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        tokens = get_tokens_for_user(user)
        return Response({
            'access': tokens['access'],
            'refresh': tokens['refresh'],
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'mobile_number': user.mobile_number,
                'is_staff': user.is_staff,
                'role': user.role,
            }
        }, status=status.HTTP_200_OK)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user


class CreateAdminView(APIView):
    """Allows existing admins to create new admin accounts."""
    permission_classes = [IsAdminUser]

    def post(self, request):
        name = request.data.get('name', '').strip()
        email = request.data.get('email', '').strip().lower()
        mobile = request.data.get('mobile_number', '').strip()
        password = request.data.get('password', '')

        if not all([name, email, mobile, password]):
            return Response({'detail': 'All fields are required.'}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({'email': 'Email already registered.'}, status=400)
        if User.objects.filter(mobile_number=mobile).exists():
            return Response({'mobile_number': 'Mobile number already registered.'}, status=400)

        user = User(
            email=email,
            username=email,
            name=name,
            mobile_number=mobile,
            is_staff=True,
            is_superuser=False,
        )
        user.set_password(password)
        user.save()

        return Response({
            'detail': f'Admin account for {name} created successfully.',
            'user': {'id': user.id, 'email': user.email, 'name': user.name}
        }, status=201)


class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user).order_by('-is_default', '-created_at')

    def perform_create(self, serializer):
        # If this is the first address, make it default automatically
        is_default = serializer.validated_data.get('is_default', False)
        if not Address.objects.filter(user=self.request.user).exists():
            is_default = True
        
        if is_default:
            Address.objects.filter(user=self.request.user).update(is_default=False)
            
        serializer.save(user=self.request.user, is_default=is_default)

    def perform_update(self, serializer):
        if serializer.validated_data.get('is_default', False):
            Address.objects.filter(user=self.request.user).update(is_default=False)
        serializer.save()

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).order_by('-added_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserListView(generics.ListAPIView):
    """Allows admins to view all users."""
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class UpdateUserRoleView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            target_user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=404)

        new_role = request.data.get('role')
        if not new_role or new_role not in dict(User.ROLE_CHOICES).keys():
            return Response({'detail': 'Invalid role.'}, status=400)

        previous_role = target_user.role
        target_user.role = new_role
        
        # Determine if new role requires is_staff
        if new_role in [User.ROLE_SUPERADMIN, User.ROLE_MANAGER, User.ROLE_EMPLOYEE]:
            target_user.is_staff = True
        else:
            target_user.is_staff = False
            
        target_user.save()

        # Create Audit Log
        AuditLog.objects.create(
            admin_user=request.user,
            target_user=target_user,
            action="Role Change",
            previous_role=previous_role,
            new_role=new_role,
            ip_address=request.META.get('REMOTE_ADDR')
        )

        return Response({'detail': 'User role updated successfully.', 'role': new_role})

class AuditLogListView(generics.ListAPIView):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminUser]


class ToggleUserActiveView(APIView):
    """Allows admins to enable or disable a user account."""
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            target_user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=404)

        if target_user.is_superuser:
            return Response({'detail': 'Cannot disable a superuser account.'}, status=403)

        target_user.is_active = not target_user.is_active
        target_user.save()

        AuditLog.objects.create(
            admin_user=request.user,
            target_user=target_user,
            action="Account Toggled",
            previous_role=target_user.role,
            new_role=target_user.role,
            ip_address=request.META.get('REMOTE_ADDR')
        )

        status_str = 'enabled' if target_user.is_active else 'disabled'
        return Response({'detail': f'Account {status_str} successfully.', 'is_active': target_user.is_active})
