from django.db import models

class Template(models.Model):
    name = models.TextField(max_length=255, null=True, blank=True)
    icon = models.ImageField(null=True, blank=True)
    order = models.IntegerField(null=True, blank=True)
    content = models.TextField() #Consertar