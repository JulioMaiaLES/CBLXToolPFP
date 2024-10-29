# project/views.py
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Project
from traceback import print_exc
import json
from django.shortcuts import get_list_or_404
from django.http import JsonResponse
from .models import Project
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.http import JsonResponse

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
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def user_projects(request):
    user_projects = Project.objects.filter(email=request.user.email)
    projects_data = [
        {
            "name": project.name,
            "image": request.build_absolute_uri(project.image.url) if project.image else None
        }
        for project in user_projects
    ]
    return JsonResponse(projects_data, safe=False)