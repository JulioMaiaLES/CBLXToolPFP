#user/urls.py
from django.urls import path
from .views import get_user_email, user_profile

urlpatterns = [
    path('get-user-email/', get_user_email, name='get_user_email'),
    path('profile/', user_profile, name='user_profile'),
]
