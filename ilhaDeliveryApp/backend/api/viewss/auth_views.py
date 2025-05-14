from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from base.models import Cliente

class LoginView(APIView):
    def post(self, request):
        cpf = request.data.get('cpf')
        senha = request.data.get('senha')

        try:
            cliente = Cliente.objects.get(senha=senha, cpf=cpf)
            return Response({'message': 'Login bem-sucedido', 'cliente_id': cliente.id}, status=status.HTTP_200_OK)
        except Cliente.DoesNotExist:
            return Response({'error': 'Nome ou CPF inválido'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        return Response({'message': 'Logout realizado com sucesso'}, status=status.HTTP_200_OK)
