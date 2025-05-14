from rest_framework import generics
from rest_framework.decorators import api_view
from base.models import Cliente
from api.serializers import ClienteSerializer, PedidoSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView


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

class CriarPedidoView(APIView):
    def post(self, request):
        serializer = PedidoSerializer(data=request.data)
        if serializer.is_valid():
            pedido = serializer.save()
            return Response({'message': 'Pedido criado com sucesso!', 'pedido_id': pedido.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
