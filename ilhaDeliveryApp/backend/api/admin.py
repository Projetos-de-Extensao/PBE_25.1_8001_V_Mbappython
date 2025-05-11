

# @admin.register(Produto)
# class ProdutoAdmin(admin.ModelAdmin):
#     list_display = ('nome', 'preco', 'disponivel', 'created')  # colunas visíveis
#     list_filter = ('disponivel',)
#     search_fields = ('nome', 'descricao')


from django.contrib import admin
from base.models import Cliente

admin.site.register(Cliente)
