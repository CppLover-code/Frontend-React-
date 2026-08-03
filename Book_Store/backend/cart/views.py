from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Cart
from books.models import Book
from .models import CartItem
from .serializers import AddToCartSerializer, CartSerializer, UpdateCartItemSerializer


class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.cart
    
class AddToCartView(generics.GenericAPIView):
    serializer_class = AddToCartSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        book_id = serializer.validated_data["book_id"]
        quantity = serializer.validated_data["quantity"]
        
        book = get_object_or_404(Book, pk=book_id)
        
        if quantity > book.stock:
            return Response(
                {
                    "detail": f"Only {book.stock} item(s) left in stock."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        cart = request.user.cart
        cart_item, created = CartItem.objects.get_or_create(cart=cart, book=book, defaults={"quantity": quantity,},)
        
        if not created:
            new_quantity = cart_item.quantity + quantity
            if new_quantity > book.stock:
                return Response(
                    {
                        "detail": f"Only {book.stock} item(s) left in stock."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            cart_item.quantity = new_quantity
            cart_item.save()
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK) 
    
class UpdateCartItemView(generics.GenericAPIView):
    serializer_class = UpdateCartItemSerializer
    permission_classes = [IsAuthenticated]
    
    def patch(self,request,pk):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quantity = serializer.validated_data["quantity"]
        
        cart_item = get_object_or_404(CartItem, pk=pk, cart=request.user.cart)
        
        if quantity > cart_item.book.stock:
            return Response(
                {
                    "detail": f"Only {cart_item.book.stock} item(s) left in stock."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        cart_item.quantity = quantity
        cart_item.save()
        return Response(CartSerializer(request.user.cart).data, status=status.HTTP_200_OK)

class DeleteCartItemView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self,request,pk):
        cart_item = get_object_or_404(CartItem, pk=pk, cart=request.user.cart)
        cart_item.delete()
        return Response(status=status.HTTP_200_OK)
    
class ClearCartView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self,request):
        cart = request.user.cart
        cart.items.all().delete()
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)