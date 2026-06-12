from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import UserSerializer


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

