from rest_framework.viewsets import ModelViewSet
from .models import Book
from .serializer import BookSerializer

class BookViewSet(ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    