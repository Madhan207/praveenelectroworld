from django.contrib import admin
from .models import Coupon, Notification, GSTSetting, PaymentSetting, Donation

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'business', 'discount_type', 'discount_value', 'is_active')
    list_filter = ('business', 'discount_type', 'is_active')
    search_fields = ('code',)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('user__email', 'title', 'message')

@admin.register(GSTSetting)
class GSTSettingAdmin(admin.ModelAdmin):
    list_display = ('business', 'gst_number', 'default_gst_rate', 'is_gst_inclusive')
    search_fields = ('business__name', 'gst_number')

@admin.register(PaymentSetting)
class PaymentSettingAdmin(admin.ModelAdmin):
    list_display = ('business', 'upi_enabled', 'card_enabled', 'cod_enabled', 'bank_transfer_enabled')
    list_filter = ('upi_enabled', 'card_enabled', 'cod_enabled', 'bank_transfer_enabled')
    search_fields = ('business__name',)

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('donor_name', 'business', 'amount', 'status', 'created_at')
    list_filter = ('status', 'business')
    search_fields = ('donor_name', 'donor_email', 'business__name')
