from django.contrib import admin
from .models import Order, OrderItem, PaymentVerification

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

class PaymentVerificationInline(admin.StackedInline):
    model = PaymentVerification
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline, PaymentVerificationInline]
    list_display = ('id', 'user', 'total_amount', 'status', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method')
