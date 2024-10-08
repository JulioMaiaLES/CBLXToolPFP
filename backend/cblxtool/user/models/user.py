from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

def validar_telefone(telefone):
    if len(telefone) != 11:
        raise ValidationError("O telefone deve ter exatamente 11 caracteres, incluindo o DDD.")

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Relacionamento 1:1 com User
    telephone = models.CharField(
        max_length=11,
        validators=[validar_telefone],
        blank=True,
        null=True
    )
    birth_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.user.username