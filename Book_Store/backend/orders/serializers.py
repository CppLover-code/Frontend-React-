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
            "shipping_first_name",
            "shipping_last_name",
            "shipping_phone",
            "shipping_city",
            "shipping_street",
            "shipping_postal_code",
            "created_at",
            "updated_at",
            "items",
        ]
        
class CreateOrderSerializer(serializers.Serializer):
    pass

class UpdateOrderStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Order.OrderStatus.choices)