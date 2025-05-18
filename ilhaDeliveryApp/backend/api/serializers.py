from rest_framework import serializers
from base.models import Cliente, Endereco, ProdutoSolicitado, Pedido, Pagamento, StatusPedido

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'
class EnderecoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Endereco
        fields = '__all__'

# class ProdutoSolicitadoSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProdutoSolicitado
#         fields = ['nome_produto', 'descricao', 'link', 'quantidade']

# class PedidoSerializer(serializers.ModelSerializer):
#     produtos = ProdutoSolicitadoSerializer(many=True)
#     cliente = serializers.UUIDField()
#     status = serializers.ChoiceField(choices=StatusPedido.choices, required=False)

#     class Meta:
#         model = Pedido
#         fields = ['id', 'cliente', 'origem', 'status', 'produtos']

#     def create(self, validated_data):
#         produtos_data = validated_data.pop('produtos')
#         cliente_id = validated_data.pop('cliente')
#         cliente = Cliente.objects.get(id=cliente_id)

#         # Se não vier o status, define como SOL
#         status = validated_data.get('status', StatusPedido.SOLICITADO)

#         pedido = Pedido.objects.create(cliente=cliente, status=status, **validated_data)

#         for produto_data in produtos_data:
#             ProdutoSolicitado.objects.create(pedido=pedido, **produto_data)

#         Pagamento.objects.create(pedido=pedido, tipo='pix', status='PEN')

#         return pedido
    


# class ProdutoSolicitadoSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProdutoSolicitado
#         fields = ['nome_produto', 'descricao', 'link', 'quantidade']

# class PedidoSerializer(serializers.ModelSerializer):
#     produtos = ProdutoSolicitadoSerializer(many=True)
    
#     class Meta:
#         model = Pedido
#         fields = ['id', 'cliente', 'origem', 'produtos']
#         read_only_fields = ['cliente']  # agora não é obrigatório no corpo do request

#     def create(self, validated_data):
#         produtos_data = validated_data.pop('produtos')
#         cliente = self.context['cliente']  # obtém o cliente do context
#         pedido = Pedido.objects.create(cliente=cliente, **validated_data)
#         for produto_data in produtos_data:
#             ProdutoSolicitado.objects.create(pedido=pedido, **produto_data)
#         return pedido


class ProdutoSolicitadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProdutoSolicitado
        fields = ['nome_produto', 'descricao', 'link', 'quantidade']

class PedidoSerializer(serializers.ModelSerializer):
    produtos = ProdutoSolicitadoSerializer(many=True)

    class Meta:
        model = Pedido
        fields = ['id', 'cliente', 'origem', 'produtos']

    def create(self, validated_data):
        produtos_data = validated_data.pop('produtos')
        pedido = Pedido.objects.create(**validated_data)
        for produto_data in produtos_data:
            ProdutoSolicitado.objects.create(pedido=pedido, **produto_data)
        return pedido