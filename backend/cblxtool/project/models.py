# project/models.py
from django.db import models
from django.utils.text import slugify

def user_directory_path(instance, filename):
    # Usa o email do usuário para criar uma pasta
    email_slug = slugify(instance.email)
    return f'project_images/{email_slug}/{filename}'

class Project(models.Model):
    name = models.CharField(max_length=255)  # Nome do projeto
    email = models.EmailField()  # E-mail de quem criou o projeto
    created_at = models.DateTimeField(auto_now_add=True)  # Data de criação do projeto
    image = models.ImageField(upload_to=user_directory_path, blank=True, null=True)  # Imagem do projeto

    def __str__(self):
        return self.name
