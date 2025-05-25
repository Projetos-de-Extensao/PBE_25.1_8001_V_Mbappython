from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from base.models import Pedido, StatusPedido, Notificacao
from api.authentication_operador import OperadorJWTAuthentication
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone
from api.serializers import PedidoSerializer
from datetime import datetime

class PedidosPendentesAPIView(APIView):
    authentication_classes = [OperadorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pedidos = Pedido.objects.filter(status=StatusPedido.SOLICITADO)
        dados = [{
            'id': p.id,
            'cliente': p.cliente.nome,
            'origem': p.origem,
            'data_criacao': p.data_criacao,
            'status': p.status,
        } for p in pedidos]
        return Response(dados)


class EnviarCotacaoAPIView(APIView):
    authentication_classes = [OperadorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pedido_id):
        pedido = get_object_or_404(Pedido, id=pedido_id)

        if pedido.status != StatusPedido.SOLICITADO:
            return Response({'erro': 'Pedido não está em estado solicitando cotação.'}, status=400)

        preco_final = request.data.get('preco_final')
        if not preco_final:
            return Response({'erro': 'Preço final é obrigatório.'}, status=400)
        try:
            pedido.preco_final = float(preco_final)
        except Exception:
            return Response({'erro': 'Preço final inválido.'}, status=400)

        data_entrega = request.data.get('data_entrega')
        if data_entrega:
            try:
                # Aceita formatos: 'DD/MM/YYYY', 'DD/MM/YYYY HH:MM', 'YYYY-MM-DD', etc
                for fmt in ("%d/%m/%Y", "%d/%m/%Y %H:%M", "%Y-%m-%d", "%Y-%m-%d %H:%M", "%Y-%m-%dT%H:%M:%S"):
                    try:
                        pedido.data_entrega_estimada = datetime.strptime(data_entrega, fmt)
                        break
                    except ValueError:
                        continue
                else:
                    return Response({'erro': 'Formato de data inválido. Use DD/MM/YYYY ou YYYY-MM-DD.'}, status=400)
            except Exception:
                return Response({'erro': 'Erro ao processar a data.'}, status=400)

        pedido.operador = request.user
        pedido.status = StatusPedido.COTACAO_ENVIADA
        pedido.save()

        # Cria o pagamento se ainda não existir
        from base.models import Pagamento, StatusPagamento
        if not hasattr(pedido, 'pagamento'):
            Pagamento.objects.create(
                pedido=pedido,
                tipo='pix',
                status=StatusPagamento.PENDENTE
            )

        Notificacao.objects.create(
            usuario=pedido.cliente,
            mensagem=f'Cotação enviada para o pedido #{pedido.id}',
            tipo='cotacao'
        )

        return Response({'mensagem': 'Cotação enviada com sucesso.'})


class AtualizarStatusAPIView(APIView):
    authentication_classes = [OperadorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pedido_id):
        pedido = get_object_or_404(Pedido, id=pedido_id)
        novo_status = request.data.get('status')

        if novo_status not in StatusPedido.values:
            return Response({'erro': 'Status inválido.'}, status=400)

        pedido.status = novo_status
        pedido.save()

        Notificacao.objects.create(
            usuario=pedido.cliente,
            mensagem=f'Status do seu pedido #{pedido.id} alterado para {novo_status}',
            tipo='status'
        )

        return Response({'mensagem': f'Status atualizado para {novo_status}.'})


class FinalizarPedidoAPIView(APIView):
    authentication_classes = [OperadorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pedido_id):
        pedido = get_object_or_404(Pedido, id=pedido_id)

        pedido.status = StatusPedido.ENTREGUE
        pedido.save()

        Notificacao.objects.create(
            usuario=pedido.cliente,
            mensagem=f'Seu pedido #{pedido.id} foi entregue!',
            tipo='entrega'
        )

        return Response({'mensagem': 'Pedido finalizado como entregue.'})


class NotificarAPIView(APIView):
    authentication_classes = [OperadorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pedido_id):
        pedido = get_object_or_404(Pedido, id=pedido_id)
        mensagem = request.data.get('mensagem')

        Notificacao.objects.create(
            usuario=pedido.cliente,
            mensagem=mensagem,
            tipo='custom'
        )

        return Response({'mensagem': 'Notificação enviada.'})


class PedidosOperadorAPIView(APIView):
    authentication_classes = [OperadorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        status_filtro = request.query_params.get('status')
        if status_filtro:
            pedidos = Pedido.objects.filter(status=status_filtro)
        else:
            pedidos = Pedido.objects.all()
        serializer = PedidoSerializer(pedidos, many=True)
        return Response(serializer.data)
