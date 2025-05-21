from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from base.models import Cliente
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'cpf'

    def validate(self, attrs):
        cpf = attrs.get('cpf')
        senha = attrs.get('password')
        if not cpf or not senha:
            raise serializers.ValidationError(_('CPF e senha são obrigatórios'))
        try:
            cliente = Cliente.objects.get(cpf=cpf)
            if not cliente.check_password(senha):
                raise serializers.ValidationError(_('Senha incorreta'))
        except Cliente.DoesNotExist:
            raise serializers.ValidationError(_('CPF não encontrado'))
        # Gera manualmente os tokens JWT
        refresh = RefreshToken.for_user(cliente)
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'cliente_id': str(cliente.id),
        }
        return data
