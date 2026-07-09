from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CouponViewSet, NotificationViewSet, 
    GSTSettingViewSet, PaymentSettingViewSet, DonationViewSet
)

router = DefaultRouter()
router.register(r'coupons', CouponViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'gst-settings', GSTSettingViewSet)
router.register(r'payment-settings', PaymentSettingViewSet)
router.register(r'donations', DonationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
