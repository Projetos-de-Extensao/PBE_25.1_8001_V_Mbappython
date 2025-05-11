# from rest_framework.response import Response
# from rest_framework.decorators import api_view
# from base.models import Produto
# from .serializers import ProdutoSerializer
# import logging

# logger = logging.getLogger(__name__)

# @api_view(['GET'])
# def getData(request):
#     if not Produto.objects.exists():
#         Produto.objects.create(
#             nome="Produto Teste",
#             preco=10.00,
#             descricao="Produto inserido automaticamente",
#             disponivel=True
#         )
#     produtos = Produto.objects.all()
#     serializer = ProdutoSerializer(produtos, many=True)
#     return Response(serializer.data)

# @api_view(['POST'])
# def addProduto(request):
#     serializer = ProdutoSerializer(data=request.data)
#     if serializer.is_valid():
#         produto = serializer.save()
#         print("Produto salvo:", produto)
#         return Response(serializer.data)
#     print("Erro de validação:", serializer.errors)
#     return Response(serializer.errors, status=400)


# @api_view(['DELETE'])
# def deleteProduto(request, id):
#     try:
#         produto = Produto.objects.get(id=id)
#         produto.delete() 
#         return Response({"message": "Produto excluído com sucesso!"}, status=200)
#     except Produto.DoesNotExist:
#         return Response({"message": "Produto não encontrado!"}, status=404)
#     except Exception as e:
#         return Response({"error": f"Erro ao excluir produto: {str(e)}"}, status=500)