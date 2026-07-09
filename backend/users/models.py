from django.db import models
from django.contrib.auth.models import AbstractUser
from products.models import Product

class User(AbstractUser):
    ROLE_SUPERADMIN = 'superadmin'
    ROLE_MANAGER = 'manager'
    ROLE_EMPLOYEE = 'employee'
    ROLE_CUSTOMER = 'customer'
    ROLE_CHOICES = (
        (ROLE_SUPERADMIN, 'Super Admin'),
        (ROLE_MANAGER, 'Store Manager'),
        (ROLE_EMPLOYEE, 'Employee'),
        (ROLE_CUSTOMER, 'Customer'),
    )

    # Make email unique and required
    email = models.EmailField(unique=True)
    mobile_number = models.CharField(max_length=15, unique=True)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_CUSTOMER)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'mobile_number', 'name']

    def __str__(self):
        return self.email

class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    title = models.CharField(max_length=50, default='Home')
    full_name = models.CharField(max_length=200)
    mobile_number = models.CharField(max_length=15)
    address_line = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.user.email}"

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.email} - {self.product.name}"

class AuditLog(models.Model):
    admin_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='performed_actions')
    target_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='audit_logs')
    action = models.CharField(max_length=255)
    previous_role = models.CharField(max_length=50, blank=True)
    new_role = models.CharField(max_length=50, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        admin = self.admin_user.email if self.admin_user else "System"
        target = self.target_user.email if self.target_user else "Unknown"
        return f"{admin} changed {target}'s role from {self.previous_role} to {self.new_role} at {self.timestamp}"
