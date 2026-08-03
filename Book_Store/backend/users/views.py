from .utils import create_auth_response
from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import LoginSerializer
from rest_framework.exceptions import AuthenticationFailed
from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return create_auth_response(
        user=user,
        serializer=UserSerializer,
        status_code=status.HTTP_201_CREATED,
    )
    
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data["user"]
        
        return create_auth_response(
            user=user,
            serializer=UserSerializer,
            status_code=status.HTTP_200_OK,
        )   

class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            raise AuthenticationFailed("Refresh token is missing")

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

            response = Response(
                {"message": "Logged out successfully"},
                status=status.HTTP_200_OK,
            )

            response.delete_cookie("refresh_token")
            return response

        except TokenError:
            raise AuthenticationFailed(
                "Invalid or expired refresh token"
            )
    
class RefreshView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        
        if not refresh_token:
            raise AuthenticationFailed("Refresh token is required")
        
        try:
            refresh = RefreshToken(refresh_token)
            access = str(refresh.access_token)
            return Response(
                {
                    "access": access,
                },
                status=status.HTTP_200_OK,
            )
        except TokenError:
            raise AuthenticationFailed("Invalid refresh token")

class MeView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user
    
