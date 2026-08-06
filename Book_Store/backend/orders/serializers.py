from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = OrderItem
        fields = [
            "id",
            "book",
            "book_title",
            "book_cover",
            "price",
            "quantity",
            "subtotal",
        ]

class OrderSerializer(serializers.ModelSerializer):
    
    items = OrderItemSerializer(
        many=True,
        read_only=True
        )
    
    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "status",
            "total_price",
            "created_at",
            "updated_at",
            "items",
        ]
        
class CreateOrderSerializer(serializers.Serializer):
    pass