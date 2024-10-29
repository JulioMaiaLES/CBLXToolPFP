#user/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
import json
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from .models.user import Profile # Importar o modelo Perfil
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from datetime import datetime
import traceback

User = get_user_model()

def get_user_email(request):
    if request.user.is_authenticated:  # Verificar se o usuário está autenticado
        user_id = request.user.id  # Captura o ID do usuário autenticado
        try:
            user = User.objects.get(pk=user_id)
            return JsonResponse({'email': user.email})
        except User.DoesNotExist:
            return JsonResponse({'error': 'Usuário não encontrado'}, status=404)
    else:
        return JsonResponse({'error': 'Usuário não autenticado'}, status=401)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def user_profile(request):
    user = request.user
    profile_image_url = request.build_absolute_uri(user.image.url) if user.image else None
    return Response({
        "username": user.username,
        "email": user.email,
        "profile_image": profile_image_url,
    })