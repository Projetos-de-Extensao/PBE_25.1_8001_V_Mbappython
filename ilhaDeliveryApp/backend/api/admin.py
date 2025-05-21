

# @admin.register(Produto)
# class ProdutoAdmin(admin.ModelAdmin):
#     list_display = ('nome', 'preco', 'disponivel', 'created')  # colunas visíveis
#     list_filter = ('disponivel',)
#     search_fields = ('nome', 'descricao')


from django.contrib import admin
from base.models import Cliente, Endereco, Pedido, ProdutoSolicitado, Operador, Administrador, Pagamento, Notificacao

admin.site.register(Cliente)
admin.site.register(Endereco)
admin.site.register(Pedido)
admin.site.register(ProdutoSolicitado)
admin.site.register(Operador)
admin.site.register(Administrador)
admin.site.register(Pagamento)
admin.site.register(Notificacao)