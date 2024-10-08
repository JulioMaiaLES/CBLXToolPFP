from django.db import models
from .template import Template

class Investigate(Template):
    guiding_question = models.TextField(max_length=2056, null=True, blank=True)
    guiding_resource = models.TextField(max_length=2056, null=True, blank=True)
    guiding_activity = models.TextField(max_length=2056, null=True, blank=True)
    result = models.TextField(max_length=2056, null=True, blank=True)
    date_start = models.CharField(max_length=255, null=True, blank=True)
    date_end = models.CharField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return self.guiding_activity