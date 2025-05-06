from django.urls import path
from . import views
from .views import deleteProduto

urlpatterns = [
    path('verProdutos', views.getData),
    path('addProduto', views.addProduto),
    path('deleteProduto/<int:id>/', deleteProduto, name='delete_produto'),
]
