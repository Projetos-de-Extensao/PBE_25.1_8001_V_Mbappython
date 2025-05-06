from django.urls import path
from . import views

urlpatterns = [
    path('verProdutos', views.getData),
    path('addProduto', views.addProduto),
]
