from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from base.models import Cliente, Endereco
from api.serializers import ClienteSerializer
from django.db import transaction
from django.contrib.auth.hashers import make_password
import logging

logger = logging.getLogger(__name__)

class LoginView(APIView):
    def post(self, request):
        cpf = request.data.get('cpf')
        senha = request.data.get('senha')

        # Limpa o CPF
        cpf_limpo = ''.join(filter(str.isdigit, str(cpf)))
        logger.info(f"Tentando login com CPF limpo: '{cpf_limpo}'")
        
        try:
            # Tenta encontrar o cliente pelo CPF limpo
            cliente = Cliente.buscar_por_cpf(cpf_limpo)
            if not cliente:
                logger.warning(f"CPF não encontrado: {cpf_limpo}")
                return Response({'error': 'CPF não encontrado'}, status=status.HTTP_401_UNAUTHORIZED)
                
            logger.info(f"Cliente encontrado: ID={cliente.id}, CPF={cliente.cpf}")
            
            if cliente.check_password(senha):
                logger.info(f"Login bem-sucedido para cliente ID={cliente.id}")
                return Response({'message': 'Login bem-sucedido', 'cliente_id': cliente.id}, status=status.HTTP_200_OK)
            else:
                logger.warning(f"Senha incorreta para cliente ID={cliente.id}")
                return Response({'error': 'Senha inválida'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.error(f"Erro no login: {str(e)}")
            return Response({'error': f'Erro no login: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
            
        # Limpa o CPF, mantendo apenas números
        cpf_limpo = ''.join(filter(str.isdigit, cpf))
        if len(cpf_limpo) != 11:
            return Response({'error': 'CPF inválido'}, status=400)

        if Cliente.objects.filter(nome=nome).exists():
            return Response({'error': 'Nome de usuário já existe'}, status=400)
        if Cliente.objects.filter(cpf=cpf_limpo).exists():
            return Response({'error': 'CPF já cadastrado'}, status=400)

        try:
            with transaction.atomic():
                cliente = Cliente.objects.create(
                    nome=nome,
                    cpf=cpf_limpo,
                    telefone=telefone,
                    senha=make_password(senha)
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
