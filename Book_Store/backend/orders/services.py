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
    
    with transaction.atomic():
        
        order = Order.objects.create(
            user=user,
        )
        
        total_price = Decimal("0.00")
        for item in cart_items:
            
            validate_stock(item.book, item.quantity)
            
            subtotal = item.book.price * item.quantity
            total_price += subtotal
            
            # Create the order item
            OrderItem.objects.create(
                order=order,
                book=item.book,
                book_title=item.book.title,
                book_cover=item.book.cover,
                quantity=item.quantity,
                price=item.book.price,
                subtotal=subtotal,   
            )
            
        # Update the order total price
        order.total_price = total_price
        order.save(update_fields=["total_price"])
           
        # Update the book stock
        for item in cart_items:
            book = item.book
            book.stock -= item.quantity
                
            book.save(update_fields=["stock"])
            
        # Delete the cart items
        cart_items.delete()
            
    return order
        