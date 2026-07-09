from django.contrib import admin
from .models import User, Address, Wishlist, AuditLog

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'name', 'mobile_number', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('email', 'name', 'mobile_number')
    ordering = ('-id',)

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'full_name', 'city', 'state', 'is_default')
    list_filter = ('is_default', 'city', 'state')
    search_fields = ('user__email', 'full_name', 'city', 'pincode')

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'added_at')
    search_fields = ('user__email', 'product__name')

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'admin_user', 'target_user', 'action', 'previous_role', 'new_role', 'timestamp')
    list_filter = ('action', 'previous_role', 'new_role', 'timestamp')
    search_fields = ('admin_user__email', 'target_user__email', 'action')
    readonly_fields = ('admin_user', 'target_user', 'action', 'previous_role', 'new_role', 'ip_address', 'timestamp')

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
