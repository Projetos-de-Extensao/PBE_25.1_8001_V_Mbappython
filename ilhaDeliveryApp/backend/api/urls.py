# from django.urls import path
# # from . import views
# # from .views import deleteProduto, addProduto, getData

# urlpatterns = [
#     # path('verProdutos', getData, name='getdata'),
#     # path('addProduto', addProduto, name='add_produto'),
#     # path('deleteProduto/<int:id>/', deleteProduto, name='delete_produto'),
# ]


from django.urls import path
from api.viewss.cliente_views import getClientes, addCliente
from api.viewss.auth_views import LoginView

urlpatterns = [
    path('verClientes', getClientes, name='verProduto'),
    path('addClientes', addCliente, name='addCliente'),
    path('login', LoginView.as_view(), name='login'),
]

