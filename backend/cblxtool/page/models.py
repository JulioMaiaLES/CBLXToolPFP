from django.db import models
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import User
from content.models.content import Content

class Page(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=0)  # Atualizar para usar User
    content = models.ManyToManyField(Content, related_name='paginas')
    index_page = models.IntegerField(default=0)



    def save(self, *args, **kwargs):
        if not self.user_id:
            try:
                # Criar ou obter o usuário padrão
                self.usuario = User.objects.get_or_create(
                    username="default_user",  # O campo 'username' é obrigatório no modelo User
                    email="default@exemplo.com",
                    defaults={'password': 'default'}  # O campo 'password' deve ser criptografado ou tratado
                )[0]
            except User.DoesNotExist:
                raise ValueError("Usuário padrão não encontrado ou não pode ser criado")
        super(Page, self).save(*args, **kwargs)