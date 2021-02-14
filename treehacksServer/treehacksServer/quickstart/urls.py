"""treehacksServer URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
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
from django.contrib import admin
from django.conf.urls import url
from django.urls import include, path

from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

from treehacksServer.quickstart import views as quickstart_views

classSessionRouter = DefaultRouter()
classSessionRouter.register(r'retrieve', quickstart_views.ClassSessionListDetailView, basename='class-retrieve')
classSessionRouter.register(r'create', quickstart_views.ClassSessionCreateView, basename='class-create')
classSessionRouter.register(r'update', quickstart_views.ClassSessionUpdateView, basename='class-update')
classSessionRouter.register(r'end', quickstart_views.ClassSessionEndView, basename='class-end')
classSessionRouter.register(r'delete', quickstart_views.ClassSessionDestroyView, basename='class-delete')

quizRouter = DefaultRouter()
quizRouter.register(r'submit', quickstart_views.QuizResponseCreateView, basename='quiz-submit')

urlpatterns = [
    path('auth/login/', obtain_auth_token, name='login'),
    url(r'auth/signup/$', quickstart_views.CreateUserView.as_view(), name='signup'),
    url(r'ping/$', quickstart_views.StatusCheckView.as_view(), name='ping'),
    url(r'class-session/', include(classSessionRouter.urls), name='class-session'),
    url(r'quiz/', include(quizRouter.urls), name='quiz'),
    url(r'chatbot/(?P<pk>[0-9]+)/$', quickstart_views.ChatBotQuestionAnswerView.as_view(), name='quiz'),
]
