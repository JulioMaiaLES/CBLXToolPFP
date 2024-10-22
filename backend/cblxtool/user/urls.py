#user/urls.py
from django.urls import path
from .views import get_user_email

urlpatterns = [
    path('get-user-email/', get_user_email, name='get_user_email'),
]
