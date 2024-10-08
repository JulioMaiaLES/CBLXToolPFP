from django.db import models
from .content import Content

class File(Content):
    file_name = models.CharField(max_length=255, default="Sem Nome de Arquivo")
    file_source = models.FileField(upload_to='media/files/', default="Sem Arquivo")