from rest_framework.viewsets import ModelViewSet
from .models import Book
from .serializer import BookSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.permissions import BasePermission, SAFE_METHODS

class BookViewSet(ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class AllowEveryone(BasePermission):
    def has_permission(self, request, view):
        return True
    
class DenyEveryone(BasePermission):
    def has_permission(self, request, view):
        return False
    
class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        
        return request.user.is_staff
    
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.user.is_staff
    
    