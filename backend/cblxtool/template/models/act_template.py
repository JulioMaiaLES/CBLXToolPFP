from django.db import models
from .template import Template

class Act(Template):
    image = models.ImageField(upload_to='act_images', null=True, blank=True)
    file = models.FileField(upload_to='act_files', null=True, blank=True)
    text_input = models.TextField(max_length=2056, null=True, blank=True)

    def __str__(self):
        return self.text_input