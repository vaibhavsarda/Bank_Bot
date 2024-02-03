from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("get_gpt_response/", views.get_gpt_response, name="get_gpt_response")
]