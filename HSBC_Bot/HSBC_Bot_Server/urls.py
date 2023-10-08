from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("get_gpt_response/", views.get_gpt_response, name="get_gpt_response"),
    path("get_photo/", views.get_photo, name="get_photo"),
    path("get_mail/", views.get_mail, name="get_mail")
]