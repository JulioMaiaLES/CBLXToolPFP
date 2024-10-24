# project/models.py
from django.db import models

class Project(models.Model):
    name = models.CharField(max_length=255)  # Nome do projeto
    email = models.EmailField()  # E-mail de quem criou o projeto

    created_at = models.DateTimeField(auto_now_add=True)  # Data de criação do projeto

    def __str__(self):
        return self.name
