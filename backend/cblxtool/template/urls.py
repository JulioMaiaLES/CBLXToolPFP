# engage/urls.py
from django.urls import path
from .views import get_engage_data, create_engage

urlpatterns = [
    path('', get_engage_data, name='get_engage_data'),  # Rota para obter dados
    path('create/', create_engage, name='create_engage'),  # Rota para criar dados
]

