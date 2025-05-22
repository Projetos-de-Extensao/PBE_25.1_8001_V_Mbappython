from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from base.models import Operador
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
import logging

logger = logging.getLogger(__name__)

class OperadorTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'turno'

    def validate(self, attrs):
        turno = attrs.get('turno')
        senha = attrs.get('password')

        logger.info(f"Tentando login do operador turno: {turno}")

        if not turno or not senha:
            raise serializers.ValidationError(_('Turno e senha são obrigatórios'))

        try:
            operador = Operador.objects.get(turno=turno)
        except Operador.DoesNotExist:
            raise serializers.ValidationError(_('Operador não encontrado'))

        if not operador.check_password(senha):
            raise serializers.ValidationError(_('Senha incorreta'))

        refresh = RefreshToken()
        refresh['operador_id'] = operador.id

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'operador_id': operador.id,
            'nome': operador.nome,
            'turno': operador.turno,
        }
