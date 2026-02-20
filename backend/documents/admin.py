from django.contrib import admin
from .models import Document

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'category', 'created_at')
    search_fields = ('title', 'category')
    list_filter = ('category',)
