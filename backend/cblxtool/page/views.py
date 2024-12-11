from django.shortcuts import render
from django.db import models
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from project.models import Project
from page.models import Page
import json
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes
import traceback
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.serializers import ModelSerializer

# Serializer para o modelo Page
class PageSerializer(ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'order', 'email', 'html_path', 'phase', 'project', 'created_at']

class CreatePageView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        phase = request.data.get('phase')  # Obtém a fase do corpo da requisição
        project_id = request.data.get('project_id')  # Obtém o project_id do corpo da requisição

        if not project_id or not phase:
            return Response({"error": "Projeto ou fase não especificado."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            project = Project.objects.get(id=project_id)
            result = create_next_page_for_phase(phase, project)

            if "error" in result:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)

            # Serializa o objeto Page antes de retornar
            serialized_page = PageSerializer(result["page"]).data
            return Response({
                "message": result["message"],
                "page": serialized_page,
            }, status=status.HTTP_201_CREATED)
        except Project.DoesNotExist:
            return Response({"error": "Projeto não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("Erro inesperado no backend:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Create your views here.
def create_next_page_for_phase(phase, project):
    try:
        # Valida se a fase é uma das permitidas
        if phase not in ['Engage', 'Act', 'Investigate']:
            return {"error": "Fase inválida. Use 'Engage', 'Act' ou 'Investigate'."}

        # Busca todas as páginas da fase específica e projeto
        existing_pages = Page.objects.filter(project=project, phase=phase)

        # Determina o próximo número de ordem
        next_order = (existing_pages.aggregate(models.Max('order'))['order__max'] or 0) + 1

        # Define o email do usuário e diretório base
        user_email = project.email
        base_directory = "media/user"
        phase_directory = os.path.join(base_directory, user_email, "content", "Projects", project.name, phase)

        # Caminho para o próximo arquivo HTML
        filename = f"{next_order}.html"
        html_path = os.path.join(phase_directory, filename)

        # Cria o diretório e o arquivo HTML
        os.makedirs(phase_directory, exist_ok=True)
        
        # Função de criação de template correspondente à fase
        create_template_function = {
            'Engage': create_template,
            'Act': create_template,
            'Investigate': create_template,
        }.get(phase)

        # Valida se a função de criação existe
        if not create_template_function:
            return {"error": f"Função de template não encontrada para a fase '{phase}'."}

        # Cria o template HTML
        create_template_function(filename, phase, "", phase_directory)

        # Cria a nova página no banco de dados
        new_page = Page.objects.create(
            order=next_order,
            email=user_email,
            html_path=html_path,
            phase=phase,
            project=project
        )

        print(f"Nova página criada com sucesso para a fase {phase}: {new_page}")
        return {"message": "Página criada com sucesso!", "page": new_page}

    except Exception as e:
        print(f"Erro ao criar a próxima página para a fase {phase}: {e}")
        return {"error": f"Erro ao criar a próxima página: {e}"}


def create_template(filename, title, body_content, path):
    try:
        os.makedirs(path, exist_ok=True)

        # Caminho completo do arquivo
        file_path = os.path.join(path, filename)

        # Conteúdo do arquivo HTML
        html_content = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{title}</title>
        </head>
        <body>
            Teste um dois três
        </body>
        </html>
        """

        # Cria o arquivo e escreve o conteúdo
        with open(file_path, 'w') as html_file:
            html_file.write(html_content)

        print(f"Arquivo HTML criado com sucesso: {file_path}")
        return file_path
    except Exception as e:
        print(f"Erro ao criar o arquivo HTML: {e}")
        return None