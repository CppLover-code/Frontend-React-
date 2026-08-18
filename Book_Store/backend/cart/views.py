from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response

from .models import CartItem
from .serializers import (
    AddToCartSerializer,
    CartSerializer,
    ChangeCartItemQuantitySerializer,
    UpdateCartItemSerializer,
)
from .services import (
    add_book_to_cart, 
    update_cart_item,
    change_cart_item_quantity,
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
        return Response(
        CartSerializer(cart, context={"request": request}).data,
        status=status.HTTP_200_OK,
        )
    
class UpdateCartItemView(generics.GenericAPIView):
    
    queryset = CartItem.objects.all()
    
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
        return Response(
        CartSerializer(cart, context={"request": request}).data,
        status=status.HTTP_200_OK,
        )

class ChangeCartItemQuantityView(generics.GenericAPIView):

    queryset = CartItem.objects.all()

    serializer_class = ChangeCartItemQuantitySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = change_cart_item_quantity(
            user=request.user,
            cart_item_id=pk,
            delta=serializer.validated_data["delta"],
        )
        return Response(
        CartSerializer(cart, context={"request": request}).data,
        status=status.HTTP_200_OK,
        )

class DeleteCartItemView(generics.GenericAPIView):
    
    queryset = CartItem.objects.all()
    
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, pk):
        cart = delete_cart_item(
            user=request.user,
            cart_item_id=pk,
        )
        return Response(
        CartSerializer(cart, context={"request": request}).data,
        status=status.HTTP_200_OK,
        )
    
class ClearCartView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        cart = clear_cart(request.user)

        return Response(
        CartSerializer(cart, context={"request": request}).data,
        status=status.HTTP_200_OK,
        )