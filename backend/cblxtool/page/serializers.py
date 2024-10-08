from .models import *
from rest_framework import serializers
from drf_base64.fields import Base64ImageField, Base64FileField

class PageSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Page
        fields = '__all__'

