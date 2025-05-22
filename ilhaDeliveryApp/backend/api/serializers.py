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

class ClienteComEnderecoSerializer(serializers.ModelSerializer):
    endereco = serializers.SerializerMethodField()
    
    class Meta:
        model = Cliente
        fields = ['id', 'nome', 'cpf', 'telefone', 'endereco']
    
    def get_endereco(self, obj):
        # Tenta obter o endereço do cliente
        try:
            endereco = Endereco.objects.get(cliente=obj)
            return {
                'rua': endereco.rua,
                'numero': endereco.numero,
                'cidade': endereco.cidade,
                'estado': endereco.estado,
                'cep': endereco.cep,
                'ilha': endereco.ilha,
                'endereco_completo': f"{endereco.rua}, {endereco.numero} - {endereco.ilha}"
            }
        except Endereco.DoesNotExist:
            return None

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
        fields = ['nome_produto', 'descricao', 'link', 'quantidade', 'preco_unitario']  # Adiciona preco_unitario
    
    def to_internal_value(self, data):
        # Converte preco_unitario para string se for número
        if 'preco_unitario' in data and (isinstance(data['preco_unitario'], int) or isinstance(data['preco_unitario'], float)):
            data = data.copy()
            data['preco_unitario'] = str(data['preco_unitario'])
        return super().to_internal_value(data)
    
    def to_representation(self, instance):
        # Converte preco_unitario de volta para float quando enviado ao frontend
        ret = super().to_representation(instance)
        if 'preco_unitario' in ret and ret['preco_unitario'] is not None:
            try:
                ret['preco_unitario'] = float(ret['preco_unitario'])
            except (ValueError, TypeError):
                # Mantém como está se não puder converter
                pass
        return ret

class PedidoSerializer(serializers.ModelSerializer):
    produtos = ProdutoSolicitadoSerializer(many=True)
    cliente = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all(), required=False)

    class Meta:
        model = Pedido
        fields = ['id', 'cliente', 'origem', 'produtos', 'status', 'data_criacao', 'data_entrega_estimada', 'operador']

    def create(self, validated_data):
        produtos_data = validated_data.pop('produtos')
        pedido = Pedido.objects.create(**validated_data)
        for produto_data in produtos_data:
            ProdutoSolicitado.objects.create(pedido=pedido, **produto_data)
        return pedido