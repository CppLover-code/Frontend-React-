from rest_framework.viewsets import ModelViewSet
from .models import Book
from .serializer import BookSerializer
from .permissions import IsAdminOrReadOnly
from .filters import BookFilter
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .serializer import AuthorSerializer, CategorySerializer
from .models import Author, Category

class BookViewSet(ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    filterset_class = BookFilter
    
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]
    
    search_fields = ["title", "description"]
    ordering_fields = ["title", "price", "stock"]
    ordering = ["title"]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
class AuthorViewSet(ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None