from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class Content(models.Model):
    id = models.AutoField(primary_key=True)
    order = models.IntegerField()
    content = models.TextField(default='Sem conteudo')
    type_content = models.CharField(max_length=255, default='Sem conteudo')