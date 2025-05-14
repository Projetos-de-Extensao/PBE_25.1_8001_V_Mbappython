from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from base.models import Cliente, Endereco
from api.serializers import ClienteSerializer
from django.db import transaction

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


class CadastroClienteView(APIView):
    def post(self, request):
        nome = request.data.get('nome')
        cpf = request.data.get('cpf')
        telefone = request.data.get('telefone')
        senha = request.data.get('senha')

        rua = request.data.get('rua')
        numero = request.data.get('numero')
        cidade = request.data.get('cidade')
        estado = request.data.get('estado')
        cep = request.data.get('cep')
        ilha = request.data.get('ilha')

        if not all([nome, cpf, telefone, rua, numero, cidade, estado, cep, ilha, senha]):
            return Response({'error': 'Todos os campos são obrigatórios'}, status=400)

        if Cliente.objects.filter(nome=nome).exists():
            return Response({'error': 'Nome de usuário já existe'}, status=400)
        if Cliente.objects.filter(cpf=cpf).exists():
            return Response({'error': 'CPF já cadastrado'}, status=400)

        try:
            with transaction.atomic():
                cliente = Cliente.objects.create(
                    nome=nome,
                    cpf=cpf,
                    telefone=telefone,
                    senha=senha  
                )

                Endereco.objects.create(
                    cliente=cliente,
                    rua=rua,
                    numero=numero,
                    cidade=cidade,
                    estado=estado,
                    cep=cep,
                    ilha=ilha
                )

                return Response({'message': 'Cliente cadastrado com sucesso'}, status=201)
        except Exception as e:
            return Response({'error': 'Erro no cadastro: ' + str(e)}, status=500)
