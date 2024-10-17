#login/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
import json
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from user.models.user import Profile # Importar o modelo Perfil
from datetime import datetime
import traceback

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        # Autenticar usando o email e senha
        user = authenticate(request=request, username=email, password=password)

        if user is not None:
            # Criar ou recuperar o token de autenticação associado ao modelo Profile
            token, _ = Token.objects.get_or_create(user=user)  # Isso agora está vinculado ao modelo Profile
            return JsonResponse({"token": token.key}, status=200)
        else:
            return JsonResponse({"error": "Credenciais inválidas"}, status=401)

