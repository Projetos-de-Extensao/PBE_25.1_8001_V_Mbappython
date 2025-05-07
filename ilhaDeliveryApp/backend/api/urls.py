from django.urls import path
from . import views
from .views import deleteProduto, addProduto, getData

urlpatterns = [
    path('verProdutos', getData, name='getdata'),
    path('addProduto', addProduto, name='add_produto'),
    path('deleteProduto/<int:id>/', deleteProduto, name='delete_produto'),
]
