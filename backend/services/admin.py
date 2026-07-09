from django.contrib import admin
from .models import (
    ServiceCategory, Service, ServicePackage, GalleryImage,
    Testimonial, FAQ, AvailabilitySlot, QuoteRequest,
    ContactInquiry, Booking
)


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'business', 'slug']
    list_filter = ['business']
    search_fields = ['name', 'business__name']


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'business', 'price', 'duration', 'is_active']
    list_filter = ['business', 'is_active']
    search_fields = ['name', 'business__name']
    list_editable = ['is_active']


@admin.register(ServicePackage)
class ServicePackageAdmin(admin.ModelAdmin):
    list_display = ['name', 'business', 'tier', 'price', 'badge', 'is_active', 'order']
    list_filter = ['business', 'tier', 'is_active']
    search_fields = ['name', 'business__name']
    list_editable = ['price', 'is_active', 'order']


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'business', 'caption', 'category', 'order', 'is_active']
    list_filter = ['business', 'category', 'is_active']
    search_fields = ['caption', 'business__name']
    list_editable = ['order', 'is_active']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'business', 'role', 'rating', 'is_approved', 'created_at']
    list_filter = ['business', 'is_approved', 'rating']
    search_fields = ['name', 'comment', 'business__name']
    list_editable = ['is_approved']
    actions = ['approve_selected', 'unapprove_selected']

    @admin.action(description='Approve selected testimonials')
    def approve_selected(self, request, queryset):
        queryset.update(is_approved=True)

    @admin.action(description='Unapprove selected testimonials')
    def unapprove_selected(self, request, queryset):
        queryset.update(is_approved=False)


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'business', 'order', 'is_active']
    list_filter = ['business', 'is_active']
    search_fields = ['question', 'answer', 'business__name']
    list_editable = ['order', 'is_active']


@admin.register(AvailabilitySlot)
class AvailabilitySlotAdmin(admin.ModelAdmin):
    list_display = ['date', 'business', 'is_available', 'title']
    list_filter = ['business', 'is_available']
    search_fields = ['title', 'business__name']
    list_editable = ['is_available']


@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'business', 'event_type', 'event_date', 'status', 'is_read', 'created_at']
    list_filter = ['business', 'status', 'is_read']
    search_fields = ['name', 'email', 'phone', 'business__name']
    list_editable = ['status', 'is_read']
    readonly_fields = ['created_at', 'updated_at', 'booking']


@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ['name', 'business', 'phone', 'email', 'is_read', 'created_at']
    list_filter = ['business', 'is_read']
    search_fields = ['name', 'email', 'phone', 'business__name']
    list_editable = ['is_read']
    readonly_fields = ['created_at']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['booking_id', 'name', 'business', 'event_type', 'booking_date', 'total_amount', 'status', 'created_at']
    list_filter = ['business', 'status', 'event_type']
    search_fields = ['booking_id', 'name', 'email', 'phone', 'business__name']
    list_editable = ['status']
    readonly_fields = ['booking_id', 'created_at', 'updated_at']
