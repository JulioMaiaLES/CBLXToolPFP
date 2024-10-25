# project/views.py
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Project
from traceback import print_exc
import json

class CreateProjectView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Lê os dados do corpo da requisição
            data = request.data
            print("Dados recebidos:", data)  # Adicionando log para ver os dados recebidos
            
            # Coleta os dados do projeto
            project_name = data.get('name')
            user_email = request.user.email  # Pega o email do usuário autenticado
            user_name = request.user.username  # Pega o nome do usuário autenticado

            # Verifica se o campo nome foi fornecido
            if not project_name:
                return Response({"error": "Nome do projeto é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)

            # Cria o projeto
            project = Project.objects.create(name=project_name, email=user_email)

            # Resposta de sucesso
            return Response({
                "message": "Projeto criado com sucesso!",
                "project_id": project.id,
                "user_name": user_name
            }, status=status.HTTP_201_CREATED)

        except json.JSONDecodeError:
            return Response({"error": "Erro ao decodificar JSON. Verifique os dados enviados."}, status=status.HTTP_400_BAD_REQUEST)
