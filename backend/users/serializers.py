from django.contrib.auth import get_user_model
import re
from rest_framework import serializers

User = get_user_model()  

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'password', 'confirm_password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    # Email Validation
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    # Password Validation
    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters")

        if not re.search(r'[A-Za-z]', value):
            raise serializers.ValidationError("Password must contain a letter")

        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain a number")

        return value

    # Confirm Password Match
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"error": "Passwords do not match"})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user
