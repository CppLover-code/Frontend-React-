from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Cart
from books.models import Book
from .models import CartItem
from .serializers import AddToCartSerializer, CartSerializer, UpdateCartItemSerializer
from .services import (
    add_book_to_cart, 
    update_cart_item,
    delete_cart_item,
    clear_cart,
)


class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.cart
    
class AddToCartView(generics.GenericAPIView):
    serializer_class = AddToCartSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = add_book_to_cart(
            user=request.user,
            **serializer.validated_data,
        )
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)
    
class UpdateCartItemView(generics.GenericAPIView):
    serializer_class = UpdateCartItemSerializer
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, pk):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = update_cart_item(
            user=request.user,
            cart_item_id=pk,
            quantity=serializer.validated_data["quantity"],
        )
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

class DeleteCartItemView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, pk):
        cart = delete_cart_item(
            user=request.user,
            cart_item_id=pk,
        )
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)
    
class ClearCartView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        cart = clear_cart(request.user)

        return Response(
            CartSerializer(cart).data,
            status=status.HTTP_200_OK,
        )