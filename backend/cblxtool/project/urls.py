# project/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.CreateProjectView.as_view(), name='create-project'),
    path('user-projects/', views.user_projects, name='user_projects'),
    path('set-current/', views.set_current_project, name='set_current_project'),
    path('get-current/', views.get_current_project, name='get_current_project'),
    path('<int:project_id>/pages/', views.get_project_pages, name='get_project_pages'),
]
