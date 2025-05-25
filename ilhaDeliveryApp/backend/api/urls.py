# from django.urls import path
# # from . import views
# # from .views import deleteProduto, addProduto, getData

# urlpatterns = [
#     # path('verProdutos', getData, name='getdata'),
#     # path('addProduto', addProduto, name='add_produto'),
#     # path('deleteProduto/<int:id>/', deleteProduto, name='delete_produto'),
# ]


from django.urls import path
from api.viewss.cliente_views import getClientes, addCliente, cliente_logado
from api.viewss.auth_views_new import LoginView, LogoutView, CadastroClienteView
from api.viewss.pedido_views import CriarPedidoAPIView, ListarPedidosAPIView, DetalhesPedidoAPIView, DetalhesPedidoOperadorAPIView
from api.viewss.operador_views import (
    PedidosPendentesAPIView,
    EnviarCotacaoAPIView,
    AtualizarStatusAPIView,
    FinalizarPedidoAPIView,
    NotificarAPIView,
    PedidosOperadorAPIView,
)
from api.views_jwt import CustomTokenObtainPairView
from api.views_jwt_operador import OperadorTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    
    path('verClientes', getClientes, name='verProduto'),
    path('addClientes', addCliente, name='addCliente'),
    path('cliente', cliente_logado, name='cliente_logado'),
    path('login', LoginView.as_view(), name='login'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('cadastro', CadastroClienteView.as_view(), name='cadastro'),
    path('pedidos/criar', CriarPedidoAPIView.as_view(), name='criar-pedido'),
    path('pedidos', ListarPedidosAPIView.as_view(), name='pedidos'),
    path('pedidos/<int:pedido_id>', DetalhesPedidoAPIView.as_view(), name='DetalhesPedidos'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('operador/token/', OperadorTokenObtainPairView.as_view(), name='operador_token_obtain_pair'),
    path('operador/pedidos/pendentes/', PedidosPendentesAPIView.as_view(), name='pedidos_pendentes'),
    path('operador/pedido/<int:pedido_id>/enviar-cotacao/', EnviarCotacaoAPIView.as_view(), name='enviar_cotacao'),
    path('operador/pedido/<int:pedido_id>/atualizar-status/', AtualizarStatusAPIView.as_view(), name='atualizar_status'),
    path('operador/pedido/<int:pedido_id>/finalizar/', FinalizarPedidoAPIView.as_view(), name='finalizar_pedido'),
    path('operador/pedido/<int:pedido_id>/notificar/', NotificarAPIView.as_view(), name='notificar'),
    path('operador/pedido/<int:pedido_id>/detalhes/', DetalhesPedidoOperadorAPIView.as_view(), name='detalhes_pedido_operador'),
    path('operador/pedidos/', PedidosOperadorAPIView.as_view(), name='pedidos_operador'),
]


