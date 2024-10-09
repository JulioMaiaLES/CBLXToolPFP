from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models

def validar_telefone(telefone):
    if len(telefone) != 11:
        raise ValidationError("O telefone deve ter exatamente 11 caracteres, incluindo o DDD.")

class Profile(AbstractUser):  # Herdando de AbstractUser
    telephone = models.CharField(
        max_length=11,
        validators=[validar_telefone],
        blank=True,
        null=True
    )
    birth_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.username
