from rest_framework import serializers
from base.models import Cliente, Endereco, ProdutoSolicitado, Pedido, Pagamento, StatusPedido
from django.utils.timezone import localtime


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


class ProdutoSolicitadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProdutoSolicitado
        fields = ['nome_produto', 'descricao', 'link', 'quantidade', 'preco_unitario']
    
    def to_internal_value(self, data):
        if 'preco_unitario' in data and (isinstance(data['preco_unitario'], int) or isinstance(data['preco_unitario'], float)):
            data = data.copy()
            data['preco_unitario'] = str(data['preco_unitario'])
        return super().to_internal_value(data)
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if 'preco_unitario' in ret and ret['preco_unitario'] is not None:
            try:
                ret['preco_unitario'] = float(ret['preco_unitario'])
            except (ValueError, TypeError):
                pass
        return ret


class PedidoSerializer(serializers.ModelSerializer):
    produtos = ProdutoSolicitadoSerializer(many=True)
    cliente = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all(), required=False)

    data_criacao = serializers.SerializerMethodField()
    data_entrega_estimada = serializers.SerializerMethodField()
    data_entrega_efetiva = serializers.SerializerMethodField()

    class Meta:
        model = Pedido
        fields = [
            'id', 'cliente', 'origem', 'produtos', 'status',
            'data_criacao', 'data_entrega_estimada', 'data_entrega_efetiva',
            'operador', 'preco_final','frete'
        ]

    def create(self, validated_data):
        produtos_data = validated_data.pop('produtos')
        pedido = Pedido.objects.create(**validated_data)
        for produto_data in produtos_data:
            ProdutoSolicitado.objects.create(pedido=pedido, **produto_data)
        return pedido

    def get_data_criacao(self, obj):
        return localtime(obj.data_criacao).isoformat() if obj.data_criacao else None

    def get_data_entrega_estimada(self, obj):
        return localtime(obj.data_entrega_estimada).isoformat() if obj.data_entrega_estimada else None

    def get_data_entrega_efetiva(self, obj):
        return localtime(obj.data_entrega_efetiva).isoformat() if obj.data_entrega_efetiva else None
