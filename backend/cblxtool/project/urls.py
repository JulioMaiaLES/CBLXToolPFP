from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.CreateProjectView.as_view(), name='create-project'),
    path('user-projects/', views.user_projects, name='user_projects'),
]
