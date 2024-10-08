from .models.content import Content
from rest_framework import serializers
from drf_base64.fields import Base64ImageField, Base64FileField

class ContentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Content
        fields = '__all__'
