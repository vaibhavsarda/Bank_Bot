from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("get_gpt_response/", views.get_gpt_response, name="get_gpt_response"),
    path("get_financial_recommendation/", views.get_financial_recommendation, name="get_financial_recommendation"),
    path("get_products_and_services/", views.get_products_and_services, name="get_products_and_services")
    path("yes_no_question/", views.yes_no_question, name="yes_no_question"),
    path("get_photo/",views.get_photo,name="get_photo")

]