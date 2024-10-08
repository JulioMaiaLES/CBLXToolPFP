from .models.template import Template
from rest_framework import serializers
from drf_base64.fields import Base64ImageField, Base64FileField

class TemplateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Template
        fields = '__all__'
        read_only_fields = ('id',)
