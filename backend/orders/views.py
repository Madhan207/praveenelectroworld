from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, PaymentVerification
from .serializers import OrderSerializer, PaymentVerificationSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            # Allow admins to retrieve/update any order
            if self.action != 'list':
                return Order.objects.all().order_by('-created_at')
            # Only return all orders in list view if explicitly requested
            if self.request.query_params.get('all') == 'true':
                return Order.objects.all().order_by('-created_at')
                
        # Otherwise return user's own orders
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def get_permissions(self):
        if self.action in ['update', 'partial_update']:
            from rest_framework.permissions import IsAdminUser
            return [IsAdminUser()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PaymentVerificationViewSet(viewsets.ModelViewSet):
    queryset = PaymentVerification.objects.all()
    serializer_class = PaymentVerificationSerializer
    permission_classes = [IsAuthenticated]
