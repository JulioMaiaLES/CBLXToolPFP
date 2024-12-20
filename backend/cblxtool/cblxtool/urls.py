"""
URL configuration for cblxtool project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# urls.py (principal)
from django.contrib import admin
from django.urls import path, include
from template.views import create_investigate, create_act
from template import urls as template_urls
from register import urls as register_urls
from login import urls as login_urls
from user import urls as profile_urls  # Alteração: renomeado para mais clareza
from project import urls as project_urls
from django.conf import settings
from django.conf.urls.static import static
from page.views import CreatePageView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('engage/', include(template_urls)),
    path('investigate/', create_investigate, name='investigate'),
    path('act/', create_act, name='act'),
    path('api/projects/', include(project_urls)),
    path('', include(login_urls)),
    path('', include(register_urls)),
    path('api/user/', include(profile_urls)),  # Adicione o prefixo 'api/user/'
    path('pages/create/', CreatePageView.as_view(), name='create_page'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)