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
from api.viewss.auth_views import LoginView, LogoutView,  CadastroClienteView
from api.viewss.pedido_views import CriarPedidoAPIView, ListarPedidosAPIView, DetalhesPedidoAPIView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from api.views_jwt import CustomTokenObtainPairView

urlpatterns = [
    path('verClientes', getClientes, name='verProduto'),
    path('addClientes', addCliente, name='addCliente'),
    path('login', LoginView.as_view(), name='login'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('cadastro', CadastroClienteView.as_view(), name='cadastro'),
    path('pedidos/criar', CriarPedidoAPIView.as_view(), name='criar-pedido'),
    path('pedidos', ListarPedidosAPIView.as_view(), name='pedidos'),
    path('pedidos/<uuid:pedido_id>', DetalhesPedidoAPIView.as_view(), name='DetalhesPedidos'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

