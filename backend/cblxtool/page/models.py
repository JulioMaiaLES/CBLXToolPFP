from django.conf import settings  # Importar settings para acessar AUTH_USER_MODEL
from django.db import models
from content.models.content import Content

class Page(models.Model):
    PHASE_CHOICES = [
        ('Engage', 'Engage'),
        ('Act', 'Act'),
        ('Investigate', 'Investigate'),
    ]

    order = models.PositiveIntegerField()
    email = models.EmailField()
    name = models.CharField(max_length=255)
    html_path = models.CharField(max_length=255) # o caminho é media/user/'user.email'/'project.projectname'/'fasename'/'order'.html
    phase = models.CharField(max_length=20, choices=PHASE_CHOICES)
    project = models.ForeignKey('project.Project', on_delete=models.CASCADE, related_name='pages', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.phase} - {self.html_path} (Order: {self.order})"