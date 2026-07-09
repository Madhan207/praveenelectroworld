from django.db import models
from products.models import Product, Business

class Supplier(models.Model):
    business = models.ForeignKey(Business, related_name='suppliers', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    gstin = models.CharField(max_length=50, blank=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class PurchaseOrder(models.Model):
    STATUS_CHOICES = (
        ('Draft', 'Draft'),
        ('Ordered', 'Ordered'),
        ('Partial', 'Partially Received'),
        ('Received', 'Received'),
        ('Cancelled', 'Cancelled'),
    )

    po_number = models.CharField(max_length=100, unique=True)
    business = models.ForeignKey(Business, related_name='purchase_orders', on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, related_name='purchase_orders', on_delete=models.SET_NULL, null=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    expected_delivery_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"PO {self.po_number} - {self.supplier.name if self.supplier else 'Unknown'}"

class PurchaseOrderItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='purchase_history', on_delete=models.CASCADE)
    
    quantity_ordered = models.PositiveIntegerField()
    quantity_received = models.PositiveIntegerField(default=0)
    
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.quantity_ordered}x {self.product.name} (PO: {self.purchase_order.po_number})"
