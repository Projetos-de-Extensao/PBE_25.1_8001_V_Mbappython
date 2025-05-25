# @admin.register(Produto)
# class ProdutoAdmin(admin.ModelAdmin):
#     list_display = ('nome', 'preco', 'disponivel', 'created')  # colunas visíveis
#     list_filter = ('disponivel',)
#     search_fields = ('nome', 'descricao')


from django.contrib import admin
from base.models import Cliente, Endereco, Pedido, ProdutoSolicitado, Operador, Administrador, Pagamento, Notificacao
from django import forms
from django.contrib.auth.hashers import make_password



class OperadorAdminForm(forms.ModelForm):
    class Meta:
        model = Operador
        fields = '__all__'

    def clean_senha(self):
        senha = self.cleaned_data.get('senha')
        if senha and not senha.startswith('pbkdf2_'):
            return make_password(senha)
        return senha

class OperadorAdmin(admin.ModelAdmin):
    form = OperadorAdminForm




admin.site.register(Cliente)
admin.site.register(Endereco)
admin.site.register(Pedido)
admin.site.register(ProdutoSolicitado)
admin.site.register(Operador, OperadorAdmin)
admin.site.register(Administrador)
admin.site.register(Pagamento)
admin.site.register(Notificacao)