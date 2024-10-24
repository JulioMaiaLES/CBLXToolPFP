# login/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
import json

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            user = authenticate(request=request, username=email, password=password)

            if user is not None:
                token, _ = Token.objects.get_or_create(user=user)
                return JsonResponse({"token": token.key}, status=200)
            else:
                return JsonResponse({"error": "Credenciais inválidas"}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Erro ao decodificar JSON. Verifique os dados enviados."}, status=400)

    return JsonResponse({"error": "Método não permitido. Use POST."}, status=405)
