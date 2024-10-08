from django.db import models
from .content import Content

class Table(Content):
    column = models.IntegerField()
    line = models.IntegerField()
    element = models.CharField(max_length=255)