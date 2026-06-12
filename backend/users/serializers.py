from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'mobile_number', 'name', 'is_staff', 'password')
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
