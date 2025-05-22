from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from base.models import Cliente
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
import logging

logger = logging.getLogger(__name__)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'cpf'
    
    def validate(self, attrs):
        cpf = attrs.get('cpf')
        senha = attrs.get('password')
        
        logger.info(f"Tentando login JWT com CPF: '{cpf}'")
        logger.info(f"Atributos recebidos: {attrs}")
        
        if not cpf or not senha:
            logger.warning("CPF ou senha não fornecidos")
            raise serializers.ValidationError(_('CPF e senha são obrigatórios'))
        
        try:
            # Limpa o CPF
            cpf_limpo = ''.join(filter(str.isdigit, str(cpf)))
            
            # Verifique todos os CPFs no banco de dados para debug
            todos_cpfs = list(Cliente.objects.all().values_list('cpf', flat=True))
            logger.info(f"CPFs disponíveis no banco: {todos_cpfs}")
            
            # Tentativa de buscar pelo CPF ignorando formatação
            cliente = Cliente.buscar_por_cpf(cpf_limpo)
            if not cliente:
                logger.warning(f"CPF não encontrado: {cpf_limpo}")
                raise serializers.ValidationError(_('CPF não encontrado'))
            
            logger.info(f"Cliente encontrado: ID={cliente.id}, CPF={cliente.cpf}")
            
            if not cliente.check_password(senha):
                logger.warning(f"Senha incorreta para CPF: {cpf}")
                raise serializers.ValidationError(_('Senha incorreta'))
        except Cliente.DoesNotExist:
            logger.warning(f"CPF não encontrado: {cpf}")
            raise serializers.ValidationError(_('CPF não encontrado'))
        except Exception as e:
            logger.error(f"Erro ao validar login JWT: {str(e)}")
            raise serializers.ValidationError(f"Erro ao processar login: {str(e)}")
        
        # Gera manualmente os tokens JWT
        refresh = RefreshToken()
        
        # Adiciona claims personalizados ao token
        refresh['cliente_id'] = cliente.id
        
        # Log para debug
        logger.info(f"Token JWT gerado para cliente_id: {cliente.id}")
        
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'cliente_id': cliente.id,
        }
        return data
