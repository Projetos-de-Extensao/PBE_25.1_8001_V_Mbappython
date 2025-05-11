from rest_framework import generics
from rest_framework.decorators import api_view
from base.models import Cliente
from api.serializers import ClienteSerializer
from rest_framework.response import Response


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