from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from base.models import Pedido, ProdutoSolicitado, Cliente
from api.serializers import PedidoSerializer, ProdutoSolicitadoSerializer, Pagamento, StatusPedido
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated


# class CriarPedidoAPIView(APIView):
#     def post(self, request):
#         cliente_id = request.data.get('cliente')
#         if not cliente_id:
#             return Response({'erro': 'ID do cliente não enviado'}, status=400)
        
#         try:
#             cliente = Cliente.objects.get(id=cliente_id)
#         except Cliente.DoesNotExist:
#             return Response({'erro': 'Cliente não encontrado'}, status=404)

#         dados = request.data.copy()
#         dados['cliente'] = str(cliente.id)  # Certifique-se que é string para o UUIDField

#         serializer = PedidoSerializer(data=dados)
#         if serializer.is_valid():
#             pedido = serializer.save()
#             return Response(PedidoSerializer(pedido).data, status=201)
#         else:
#             # Retorna os erros detalhados
#             return Response(serializer.errors, status=400)


class CriarPedidoAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        # Obter cliente_id do usuário autenticado
        cliente_id = None
        if hasattr(user, 'id') and user.id:
            cliente_id = user.id
        elif hasattr(request, 'auth') and request.auth:
            # SimpleJWT: request.user pode ser Anonymous, mas request.auth tem o payload
            cliente_id = request.auth.get('cliente_id')
            
        if not cliente_id:
            return Response({'erro': 'Usuário não autenticado'}, status=401)
            
        # Adicionar cliente ao request.data
        data = request.data.copy()
        data['cliente'] = cliente_id
        
        serializer = PedidoSerializer(data=data)
        if serializer.is_valid():
            pedido = serializer.save()
            return Response(PedidoSerializer(pedido).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class EnviarCotacaoAPIView(APIView):
    def post(self, request, pedido_id):
        operador_id = request.data.get('operador_id')
        pedido = get_object_or_404(Pedido, id=pedido_id)

        if pedido.status != 'SOL':
            return Response({'erro': 'Pedido não está em estado solicitando cotação.'}, status=400)

        pedido.operador_id = operador_id
        pedido.status = 'CE'  # Cotação enviada
        pedido.save()

        return Response({'mensagem': 'Cotação enviada com sucesso.'})


class ConfirmarPagamentoAPIView(APIView):
    def post(self, request, pedido_id):
        pedido = get_object_or_404(Pedido, id=pedido_id)
        pagamento = get_object_or_404(Pagamento, pedido=pedido)

        if pagamento.status != 'PEN':
            return Response({'erro': 'Pagamento já processado.'}, status=400)

        pagamento.status = 'CON'
        pagamento.data_pagamento = timezone.now()
        pagamento.comprovante = request.data.get('comprovante', '')
        pagamento.save()

        pedido.status = 'PA'
        pedido.save()

        return Response({'mensagem': 'Pagamento confirmado.'})


class AtualizarStatusPedidoAPIView(APIView):
    def post(self, request, pedido_id):
        novo_status = request.data.get('status')
        pedido = get_object_or_404(Pedido, id=pedido_id)

        if novo_status not in StatusPedido.values:
            return Response({'erro': 'Status inválido.'}, status=400)

        # Validações adicionais podem ser feitas aqui conforme fluxo
        pedido.status = novo_status
        pedido.save()

        return Response({'mensagem': f'Status atualizado para {novo_status}.'})


class CancelarPedidoAPIView(APIView):
    def post(self, request, pedido_id):
        pedido = get_object_or_404(Pedido, id=pedido_id)

        if pedido.status not in ['PA', 'AND']:
            return Response({'erro': 'Pedido só pode ser cancelado após pagamento.'}, status=400)

        pedido.status = 'CAN'
        pedido.save()

        return Response({'mensagem': 'Pedido cancelado com sucesso.'})


class ListarPedidosAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        # Se JWT, user pode ser Anonymous, então pega o id do token
        cliente_id = None
        if hasattr(user, 'id') and user.id:
            cliente_id = user.id
        elif hasattr(request, 'auth') and request.auth:
            # SimpleJWT: request.user pode ser Anonymous, mas request.auth tem o payload
            cliente_id = request.auth.get('cliente_id')
        if not cliente_id:
            return Response({'erro': 'Usuário não autenticado'}, status=401)
        pedidos = Pedido.objects.filter(cliente_id=cliente_id).order_by('-id')
        serializer = PedidoSerializer(pedidos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class DetalhesPedidoAPIView(APIView):
    def get(self, request, pedido_id):
        pedido = get_object_or_404(Pedido, id=pedido_id)
        serializer = PedidoSerializer(pedido)
        return Response(serializer.data, status=status.HTTP_200_OK)