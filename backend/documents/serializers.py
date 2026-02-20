from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'text', 'ai_summary', 'category', 'created_at']
        read_only_fields = ['user', 'ai_summary', 'category', 'created_at']