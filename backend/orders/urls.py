from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, PaymentVerificationViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'payments', PaymentVerificationViewSet, basename='payment')
router.register(r'payment-verifications', PaymentVerificationViewSet, basename='payment-verification')

urlpatterns = [
    path('', include(router.urls)),
]
