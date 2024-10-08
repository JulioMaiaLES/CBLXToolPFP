from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
import json
from django.contrib.auth.models import User
from .models.user import Profile # Importar o modelo Perfil
from datetime import datetime
import traceback

def parse_iso_datetime(date_str):
    try:
        # Pega somente a parte da data YYYY-MM-DD do formato ISO 8601
        return datetime.strptime(date_str[:10], '%Y-%m-%d').date()
    except ValueError:
        return None

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        # Autenticar usando o email e senha
        user = authenticate(request=request, username=email, password=password)

        if user is not None:
            # Criar ou recuperar o token de autenticação
            token, _ = Token.objects.get_or_create(user=user)
            return JsonResponse({"token": token.key}, status=200)
        else:
            return JsonResponse({"error": "Credenciais inválidas"}, status=401)

@csrf_exempt
def register_user(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Método não permitido"}, status=405)

    try:
        data = json.loads(request.body)
        print("Dados recebidos:", data)

        # Verifica se todos os campos necessários estão presentes
        required_fields = ['email', 'name', 'phone', 'birth_date', 'password', 're_password']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            print(f"Campos faltando: {missing_fields}")
            return JsonResponse({"error": f"Campos faltando: {', '.join(missing_fields)}"}, status=400)

        # Verificar se as senhas batem
        if data['password'] != data['re_password']:
            print("As senhas não coincidem.")
            return JsonResponse({"error": "As senhas não coincidem."}, status=400)

        # Verificar se o email já foi usado
        if User.objects.filter(email=data['email']).exists():
            print("Este email já está em uso.")
            return JsonResponse({"error": "Este email já está em uso."}, status=400)

        # Converter a data de nascimento para o formato YYYY-MM-DD
        print(f"Convertendo data de nascimento: {data['birth_date']}")
        birth_date = parse_iso_datetime(data['birth_date'])
        if not birth_date:
            print(f"Data de nascimento inválida: {data['birth_date']}")
            return JsonResponse({"error": "Formato de data inválido."}, status=400)

        # Criar o usuário com o email como username
        print("Criando usuário...")
        try:
            user = User.objects.create(
                username=data['email'],  # Usar o email como username
                email=data['email'],
                password=make_password(data['password'])  # Criptografar a senha
            )
            print(f"Usuário criado: {user}")
        except Exception as e:
            print(f"Erro ao criar usuário: {traceback.format_exc()}")  # Log detalhado do erro
            return JsonResponse({"error": "Erro ao criar usuário."}, status=400)

        # Criar o perfil associado ao usuário
        print("Criando perfil...")
        try:
            perfil = Profile.objects.create(
                user=user,
                telephone=data['phone'],
                birth_date=birth_date
            )
            print(f"Perfil criado para o usuário: {perfil}")
        except Exception as e:
            print(f"Erro ao criar perfil: {traceback.format_exc()}")  # Log detalhado do erro
            return JsonResponse({"error": "Erro ao criar perfil."}, status=400)

        print("Usuário e perfil criados com sucesso.")
        return JsonResponse({"message": "Usuário e perfil criados com sucesso."}, status=201)

    except Exception as e:
        print(f"Erro ao processar a requisição: {traceback.format_exc()}")  # Log do erro detalhado
        return JsonResponse({"error": "Erro ao processar a requisição."}, status=400)
