from rest_framework import serializers

from .models import Cart, CartItem
from books.serializer import BookSerializer


class CartItemSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = (
            "id",
            "book",
            "quantity",
            "subtotal",
        )

    def get_subtotal(self, obj):
        return obj.book.price * obj.quantity


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    total_price = serializers.SerializerMethodField()
    total_items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = (
            "id",
            "items",
            "total_items",
            "total_price",
        )

    def get_total_price(self, obj):
        return sum(
            item.book.price * item.quantity
            for item in obj.items.all()
        )

    def get_total_items(self, obj):
        return sum(
            item.quantity
            for item in obj.items.all()
        )
        
class AddToCartSerializer(serializers.Serializer):
    book_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    
class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)
    
