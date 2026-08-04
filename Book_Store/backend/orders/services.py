from decimal import Decimal

from django.db import transaction
from rest_framework.exceptions import ValidationError

from cart.validators import validate_stock

from .models import Order, OrderItem

def create_order(user):
    cart = user.cart
    
    cart_items = cart.items.select_related("book")
    
    if not cart_items.exists():
        raise ValidationError(
            {
                "detail": "Your cart is empty."
            }
        )
    
   
        