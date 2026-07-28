from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Book
from .serializer import BookSerializer
from rest_framework import status
from django.shortcuts import get_object_or_404

class BookListAPIView(APIView):
    
    def get(self, request):
        
        books = Book.objects.all()
        
        serializer = BookSerializer(books, many=True)
        
        return Response(serializer.data)
    
    
    def post(self, request):
        
        serializer = BookSerializer(data=request.data)
        
        if serializer.is_valid(): 
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookDetailAPIView(APIView):
    
    def get(self, request, pk):
        
        book = get_object_or_404(Book, pk=pk)
        
        serializer = BookSerializer(book)
        
        return Response(serializer.data)
    
    
