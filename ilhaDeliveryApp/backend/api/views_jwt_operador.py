from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers_jwt_operador import OperadorTokenObtainPairSerializer

class OperadorTokenObtainPairView(TokenObtainPairView):
    serializer_class = OperadorTokenObtainPairSerializer
