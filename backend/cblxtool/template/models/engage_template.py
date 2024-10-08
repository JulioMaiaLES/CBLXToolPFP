from django.db import models
from .template import Template 

class Engage (Template):
    big_idea = models.TextField(max_length=2056, null=True, blank=True)
    essential_question = models.TextField(max_length=2056, null=True, blank=True)
    challenge = models.TextField(max_length=2056, null=True, blank=True)

    def __str__(self):
        return self.big_idea