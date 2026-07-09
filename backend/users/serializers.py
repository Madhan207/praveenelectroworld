from rest_framework import serializers
from .models import User, Address, Wishlist, AuditLog
from products.serializers import ProductSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'mobile_number', 'name', 'is_staff', 'is_active', 'password', 'role', 'date_joined')
        extra_kwargs = {'password': {'write_only': True}, 'is_staff': {'read_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['email'],
            mobile_number=validated_data['mobile_number'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        return user

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

class WishlistSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = Wishlist
        fields = ('id', 'product', 'product_details', 'added_at')
        read_only_fields = ('user', 'added_at')

class AuditLogSerializer(serializers.ModelSerializer):
    admin_email = serializers.CharField(source='admin_user.email', read_only=True)
    target_email = serializers.CharField(source='target_user.email', read_only=True)
    admin_name = serializers.CharField(source='admin_user.name', read_only=True)
    target_name = serializers.CharField(source='target_user.name', read_only=True)

    class Meta:
        model = AuditLog
        fields = '__all__'
