from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Order
from .serializers import (
    OrderSerializer,
    CreateOrderSerializer,
)
from .services import create_order

class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    
    def get_serializer_class(self):
        if self.action == "create":
            return CreateOrderSerializer
        
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = create_order(request.user)
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    