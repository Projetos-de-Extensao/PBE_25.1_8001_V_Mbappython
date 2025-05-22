from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers_jwt_new import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
