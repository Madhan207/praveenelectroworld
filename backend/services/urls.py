from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceCategoryViewSet, ServiceViewSet, ServicePackageViewSet,
    GalleryImageViewSet, TestimonialViewSet, FAQViewSet,
    AvailabilitySlotViewSet, QuoteRequestViewSet,
    ContactInquiryViewSet, BookingViewSet, TrackBookingView
)

router = DefaultRouter()
router.register(r'service-categories', ServiceCategoryViewSet)
router.register(r'services',           ServiceViewSet)
router.register(r'service-packages',   ServicePackageViewSet)
router.register(r'gallery-images',     GalleryImageViewSet)
router.register(r'testimonials',       TestimonialViewSet)
router.register(r'faqs',               FAQViewSet)
router.register(r'availability',       AvailabilitySlotViewSet)
router.register(r'quote-requests',     QuoteRequestViewSet)
router.register(r'contact-inquiries',  ContactInquiryViewSet)
router.register(r'bookings',           BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('bookings/track/', TrackBookingView.as_view(), name='track-booking'),
]
