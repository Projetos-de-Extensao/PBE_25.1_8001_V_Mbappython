from django.db import models
import uuid
from django.contrib.auth.hashers import make_password, check_password

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType



class StatusPedido(models.TextChoices):
    SOLICITADO = 'SOL', 'Solicitado'
    AGUARDANDO_CONFIRMACAO = 'AC', 'Aguardando Confirmação'
    COTACAO_ENVIADA = 'CE', 'Cotação enviada'
    PAGAMENTO_APROVADO = 'PA', 'Pagamento Aprovados'
    EM_ANDAMENTO = 'AND', 'Em Andamento'
    ENTREGUE = 'ENT', 'Entregue'
    CANCELADO = 'CAN', 'Cancelado'

class OrigemPedido(models.TextChoices):
    IFOOD = 'IFOOD', 'iFood'
    AMAZON = 'AMAZON', 'Amazon'
    MERCADO_LIVRE = 'ML', 'Mercado Livre'
    OUTRO = 'OUTRO', 'Outro'

class StatusPagamento(models.TextChoices):
    PENDENTE = 'PEN', 'Pendente'
    CONCLUIDO = 'CON', 'Concluído'
    NAO_REALIZADO = 'NR', 'Não Realizado'

class Usuario(models.Model):
    nome = models.CharField(max_length=100)
    telefone = models.CharField(max_length=15)
    senha = models.CharField(max_length=255, default="senha123")

    def set_password(self, raw_password):
        self.senha = make_password(raw_password)
        self.save(update_fields=["senha"])

    def check_password(self, raw_password):
        return check_password(raw_password, self.senha)
        
    @property
    def is_authenticated(self):
        """
        Sempre retorna True para o DRF identificar que este usuário está autenticado
        """
        return True
        
    @property
    def is_anonymous(self):
        """
        Sempre retorna False para o DRF identificar que este usuário não é anônimo
        """
        return False

    class Meta:
        abstract = True

class Cliente(Usuario):
    cpf = models.CharField(max_length=14, unique=True)
    
    @classmethod
    def buscar_por_cpf(cls, cpf):
        """
        Busca um cliente pelo CPF, removendo caracteres não numéricos
        """
        # Remove caracteres não numéricos do CPF
        cpf_limpo = ''.join(filter(str.isdigit, str(cpf)))
        
        # Busca todos os clientes
        clientes = cls.objects.all()
        
        # Compara CPF limpo com CPF limpo do banco
        for cliente in clientes:
            cpf_db_limpo = ''.join(filter(str.isdigit, cliente.cpf))
            if cpf_limpo == cpf_db_limpo:
                return cliente
        
        return None

class Operador(Usuario):
    turno = models.CharField(max_length=50)

class Administrador(Usuario):
    email = models.EmailField(unique=True)

class Endereco(models.Model):
    cliente = models.OneToOneField(Cliente, on_delete=models.CASCADE)
    rua = models.CharField(max_length=100)
    numero = models.CharField(max_length=10)
    cidade = models.CharField(max_length=50)
    estado = models.CharField(max_length=2)
    cep = models.CharField(max_length=10)
    ilha = models.CharField(max_length=50)

class Pedido(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='pedidos')
    operador = models.ForeignKey(Operador, null=True, blank=True, on_delete=models.SET_NULL)
    data_criacao = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=3, choices=StatusPedido.choices, default=StatusPedido.SOLICITADO)
    origem = models.CharField(max_length=10, choices=OrigemPedido.choices)
    data_entrega_estimada = models.DateTimeField(null=True, blank=True)
    preco_final = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Valor total cotado (produto + frete)

class ProdutoSolicitado(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='produtos')
    nome_produto = models.CharField(max_length=200)
    descricao = models.TextField(blank=True)
    link = models.URLField()
    quantidade = models.PositiveIntegerField(default=1)
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # NOVO CAMPO

class Pagamento(models.Model):
    pedido = models.OneToOneField(Pedido, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=10, default='pix')
    status = models.CharField(max_length=3, choices=StatusPagamento.choices, default=StatusPagamento.PENDENTE)
    data_pagamento = models.DateTimeField(null=True, blank=True)
    comprovante = models.CharField(max_length=255, blank=True)

class Notificacao(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    usuario = GenericForeignKey('content_type', 'object_id')

    mensagem = models.TextField()
    data_envio = models.DateTimeField(auto_now_add=True)
    tipo = models.CharField(max_length=50)

