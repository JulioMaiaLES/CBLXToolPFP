from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Project
from page.models import Page
import json
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes

class CreateProjectView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Lê os dados do corpo da requisição
            data = request.data
            print("Dados recebidos:", data)
            
            # Verificar se o usuário está autenticado
            if not request.user.is_authenticated:
                return Response({"error": "Usuário não autenticado"}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Coleta os dados do projeto
            project_name = data.get('name')
            user_email = request.user.email  # Pega o email do usuário autenticado
            user_name = request.user.username

            # Verifica se o campo nome foi fornecido
            if not project_name:
                return Response({"error": "Nome do projeto é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)

            # Cria o projeto
            project = Project.objects.create(name=project_name, email=user_email)
            
            # Criar páginas associadas ao projeto
            phases = ['Engage', 'Act', 'Investigate']
            for phase in phases:
                # Gerar o caminho dinâmico para o arquivo HTML
                html_path = f"media/pages/{user_email}/{phase}/1.html"
                
                # Criar a página associada ao projeto com 'order' fixo em 1
                Page.objects.create(
                    order=1,  # Sempre definir o order como 1
                    email=user_email,
                    html_path=html_path,
                    phase=phase,
                    project=project
                )

            # Resposta de sucesso
            return Response({
                "message": "Projeto e páginas criados com sucesso!",
                "project_id": project.id,
                "user_name": user_name
            }, status=status.HTTP_201_CREATED)

        except json.JSONDecodeError:
            return Response({"error": "Erro ao decodificar JSON. Verifique os dados enviados."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Erro desconhecido:", str(e))
            return Response({"error": "Erro desconhecido ao criar o projeto."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def user_projects(request):
    try:
        user_projects = Project.objects.filter(email=request.user.email)
        projects_data = [
            {
                "name": project.name,
                "image": request.build_absolute_uri(project.image.url) if project.image else None
            }
            for project in user_projects
        ]
        return JsonResponse(projects_data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
