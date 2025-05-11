from django.db import models
import uuid

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType



class StatusPedido(models.TextChoices):
    SOLICITADO = 'SOL', 'Solicitado'
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
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=100)
    telefone = models.CharField(max_length=15)

    class Meta:
        abstract = True

class Cliente(Usuario):
    cpf = models.CharField(max_length=14, unique=True)

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
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='pedidos')
    operador = models.ForeignKey(Operador, null=True, blank=True, on_delete=models.SET_NULL)
    data_criacao = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=3, choices=StatusPedido.choices, default=StatusPedido.SOLICITADO)
    origem = models.CharField(max_length=10, choices=OrigemPedido.choices)
    data_entrega_estimada = models.DateTimeField(null=True, blank=True)

class ProdutoSolicitado(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='produtos')
    nome_produto = models.CharField(max_length=200)
    descricao = models.TextField(blank=True)
    link = models.URLField()
    quantidade = models.PositiveIntegerField(default=1)

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

