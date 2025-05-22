from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import exceptions
from base.models import Operador

class OperadorJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        operador_id = validated_token.get('operador_id')

        if not operador_id:
            raise exceptions.AuthenticationFailed('Token inválido: operador_id não encontrado')

        try:
            operador = Operador.objects.get(id=operador_id)
        except Operador.DoesNotExist:
            raise exceptions.AuthenticationFailed('Operador não encontrado')

        return operador
