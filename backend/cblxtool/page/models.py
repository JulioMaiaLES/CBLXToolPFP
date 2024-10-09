from django.conf import settings  # Importar settings para acessar AUTH_USER_MODEL
from django.db import models
from content.models.content import Content

class Page(models.Model):
    # Alterar a ForeignKey para usar AUTH_USER_MODEL
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=0)
    content = models.ManyToManyField(Content, related_name='paginas')
    index_page = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.user_id:
            try:
                # Criar ou obter o usuário padrão
                self.user = settings.AUTH_USER_MODEL.objects.get_or_create(
                    username="default_user",  # O campo 'username' é obrigatório no modelo Profile
                    email="default@exemplo.com",
                    defaults={'password': 'default'}  # O campo 'password' deve ser criptografado ou tratado
                )[0]
            except settings.AUTH_USER_MODEL.DoesNotExist:
                raise ValueError("Usuário padrão não encontrado ou não pode ser criado")
        super(Page, self).save(*args, **kwargs)
