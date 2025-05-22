from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.settings import api_settings
from base.models import Cliente
from rest_framework import exceptions
import logging

logger = logging.getLogger(__name__)

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        """
        Tenta encontrar e retornar um usuário usando o ID reivindicado no token.
        """
        try:
            cliente_id = validated_token.get('cliente_id')
            if not cliente_id:
                logger.error(f"Token sem cliente_id: {validated_token}")
                raise exceptions.AuthenticationFailed('Token inválido, cliente_id não encontrado')
        except KeyError:
            logger.error(f"KeyError ao tentar acessar cliente_id no token")
            raise exceptions.AuthenticationFailed('Token inválido, cliente_id não encontrado')

        try:
            user = Cliente.objects.get(id=cliente_id)
            return user
        except Cliente.DoesNotExist:
            logger.error(f"Cliente com ID {cliente_id} não encontrado")
            raise exceptions.AuthenticationFailed('Usuário não encontrado')
        
    def authenticate(self, request):
        """
        Tenta autenticar as credenciais fornecidas.
        """
        header = self.get_header(request)
        if header is None:
            logger.error("Nenhum header de autenticação encontrado")
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            logger.error("Nenhum token JWT encontrado no header")
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)
            return (user, validated_token)
        except Exception as e:
            logger.error(f"Erro na autenticação: {str(e)}")
            raise
        except Exception as e:
            # Se houver erro, retorna None para indicar falha na autenticação
            # mas não lança exceção para permitir que outros autenticadores tentem
            return None
