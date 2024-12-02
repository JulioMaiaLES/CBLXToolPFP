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
import traceback
import os

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

            # Criar pastas para o projeto
            base_directory = "media/user"  # caminho no servidor
            user_directory = os.path.join(base_directory, user_email)
            content_directory = os.path.join(user_directory, "content")
            projects_directory = os.path.join(content_directory, "Projects")
            new_project_directory = os.path.join(projects_directory, project_name)

            try:
                os.makedirs(os.path.join(new_project_directory, "Engage"), exist_ok=True)
                os.makedirs(os.path.join(new_project_directory, "Investigate"), exist_ok=True)
                os.makedirs(os.path.join(new_project_directory, "Act"), exist_ok=True)
                
                print(f"Pasta criada com sucesso: {user_directory}")
            except Exception as e:
                print(f"Erro ao criar pasta: {traceback.format_exc()}")
                return JsonResponse({"error": "Erro ao criar pasta para o usuário."}, status=500)



            
            # Criar páginas associadas ao projeto
            phases = ['Engage', 'Act', 'Investigate']
            create_engage_template("1.html", "Engage", "", os.path.join(new_project_directory, "Engage"))
            create_act_template("1.html", "Act", "", os.path.join(new_project_directory, "Act"))
            create_investigate_template("1.html", "Investigate", "", os.path.join(new_project_directory, "Investigate"))
            for phase in phases:
                # Gerar o caminho dinâmico para o arquivo HTML
                html_path = f"media/user/{user_email}/{phase}/1.html"

                
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
                "id": project.id,
                "image": request.build_absolute_uri(project.image.url) if project.image else None
            }
            for project in user_projects
        ]
        return JsonResponse(projects_data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def get_project_pages(request, project_id):
    try:
        # Verifica se o projeto pertence ao usuário autenticado
        project = Project.objects.filter(id=project_id, email=request.user.email).first()
        if not project:
            return Response({"error": "Projeto não encontrado ou não autorizado."}, status=404)

        # Obtém todas as páginas associadas ao projeto
        pages = Page.objects.filter(project=project)
        pages_data = [
            {
                "order": page.order,
                "phase": page.phase,
                "html_path": page.html_path
            }
            for page in pages
        ]
        return Response({"pages": pages_data}, status=200)

    except Exception as e:
        print("Erro ao buscar páginas:", str(e))
        return Response({"error": "Erro ao buscar páginas."}, status=500)

# Função para definir o projeto atual na sessão
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def set_current_project(request):
    try:
        project_id = request.data.get('project_id')
        # Verifica se o projeto pertence ao usuário autenticado
        project = Project.objects.filter(id=project_id, email=request.user.email).first()
        if not project:
            return Response({"error": "Projeto não encontrado ou não autorizado."}, status=404)

        # Salva o project_id na sessão
        request.session['current_project_id'] = project_id

        # Log para verificar se o projeto foi salvo na sessão
        print(f"Projeto atual salvo na sessão: {request.session['current_project_id']}")

        return Response({"message": "Projeto definido com sucesso!"}, status=200)
    except Exception as e:
        print("Erro ao definir projeto:", str(e))
        return Response({"error": str(e)}, status=500)

# Função para obter o projeto atual da sessão
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def get_current_project(request):
    try:
        project_id = request.session.get('current_project_id')
        if not project_id:
            return Response({"error": "Nenhum projeto selecionado."}, status=404)
        
        # Verifica se o projeto ainda pertence ao usuário autenticado
        project = Project.objects.filter(id=project_id, email=request.user.email).first()
        if not project:
            return Response({"error": "Projeto não encontrado ou não autorizado."}, status=404)

        return Response({
            "project_id": project.id,
            "name": project.name,
            "email": project.email
        }, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
def create_engage_template(filename, title, body_content, path):
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
    
def create_investigate_template(filename, title, body_content, path):
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
    
def create_act_template(filename, title, body_content, path):
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