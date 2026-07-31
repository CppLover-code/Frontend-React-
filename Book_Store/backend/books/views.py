from rest_framework.viewsets import ModelViewSet
from .models import Book
from .serializer import BookSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .permissions import IsAdminOrReadOnly
from .filters import BookFilter
from rest_framework.filters import SearchFilter, OrderingFilter

class BookViewSet(ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    filterset_class = BookFilter
    
    filter_backends = [
        SearchFilter,
        OrderingFilter,
    ]
    
    search_fields = ["title", "description"]
    ordering_fields = ["title", "price", "stock"]
    ordering = ["title"]
    