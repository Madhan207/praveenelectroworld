from rest_framework import serializers
from .models import Order, OrderItem, PaymentVerification


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'price', 'quantity')


class PaymentVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentVerification
        fields = '__all__'
        read_only_fields = ('is_verified',)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment_verification = PaymentVerificationSerializer(read_only=True)
    user_name = serializers.ReadOnlyField(source='user.name')
    user_email = serializers.ReadOnlyField(source='user.email')

    # Write-only list of items when creating
    order_items = serializers.ListField(write_only=True, required=False, child=serializers.DictField())

    class Meta:
        model = Order
        fields = (
            'id', 'user_name', 'user_email',
            'full_name', 'mobile_number', 'address', 'city', 'state', 'pincode',
            'total_amount', 'payment_method', 'status', 'tracking_id', 'created_at',
            'items', 'payment_verification', 'order_items',
        )
        read_only_fields = ('user', 'total_amount', 'created_at')

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items', [])
        # Calculate total from items
        total = sum(float(i.get('price', 0)) * int(i.get('quantity', 1)) for i in order_items_data)
        order = Order.objects.create(**validated_data, total_amount=total)
        for item_data in order_items_data:
            OrderItem.objects.create(
                order=order,
                product_id=item_data['product'],
                price=item_data.get('price', 0),
                quantity=item_data.get('quantity', 1),
            )
        return order
