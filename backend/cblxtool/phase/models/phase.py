from django.db import models

class Phase(models.Model):
    description = models.TextField(max_length=2056)
    icon = models.ImageField(upload_to='media/images/', default="Sem Icone")
    