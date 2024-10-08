from django.db import models
from .content import Content

class Text(Content):
    text = models.TextField(default="Sem Texto")