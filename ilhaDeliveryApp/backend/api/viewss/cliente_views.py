from rest_framework import generics
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from base.models import Cliente, Endereco
from api.serializers import ClienteSerializer, PedidoSerializer, ClienteComEnderecoSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from api.authentication import CustomJWTAuthentication
from rest_framework.permissions import IsAuthenticated
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
def getClientes(request):
    cliente = Cliente.objects.all()
    serializer = ClienteSerializer(cliente, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def addCliente(request):
    serializer = ClienteSerializer(data=request.data)
    if serializer.is_valid():
        cliente = serializer.save()
        print("Produto salvo:", cliente)
        return Response(serializer.data)
    print("Erro de validação:", serializer.errors)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def cliente_logado(request):
    """
    Retorna os dados do cliente logado, incluindo seu endereço
    """
    try:
        # O cliente é adicionado ao request pelo sistema de autenticação
        cliente = request.user
        logger.info(f"Cliente logado: ID={cliente.id}, Nome={cliente.nome}")
        
        # Serializa o cliente com seu endereço
        serializer = ClienteComEnderecoSerializer(cliente)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Erro ao buscar cliente logado: {str(e)}")
        return Response(
            {"error": "Erro ao buscar dados do cliente"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

