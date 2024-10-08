from django.db import models
from .content import Content

class Imagem(Content):
    image_binary = models.ImageField(upload_to='media/images/', default="Sem Arquivo de Imagem")
    image_name = models.CharField(max_length=255, default="Sem Nome de Imagem")