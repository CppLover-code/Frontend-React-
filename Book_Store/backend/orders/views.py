from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Order
from .serializers import (
    OrderSerializer,
    CreateOrderSerializer,
)
from .services import create_order

class OrderViewSet(ModelViewSet):
    
    queryset = Order.objects.order_by("-created_at")

    permission_classes = [IsAuthenticated]
    
    http_method_names = ["get", "post"]
    
    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
           return Order.objects.none()

        if self.request.user.is_staff:
            return Order.objects.all().order_by("-created_at")

        return (
            Order.objects
            .filter(user=self.request.user)
            .order_by("-created_at")
        )
    
    def get_serializer_class(self):
        if self.action == "create":
            return CreateOrderSerializer
        
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = create_order(request.user)
        serializer = OrderSerializer(order,context=self.get_serializer_context())
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    