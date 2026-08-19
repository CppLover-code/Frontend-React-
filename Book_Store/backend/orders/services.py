from decimal import Decimal

from django.db.models import F
from django.db import transaction
from rest_framework.exceptions import ValidationError

from cart.validators import validate_stock

from .models import Order, OrderItem
from books.models import Book

import logging

logger = logging.getLogger(__name__)

def create_order(user):
    cart = user.cart
    
    cart_items = cart.items.select_related("book")
    
    required = [
        user.first_name,
        user.last_name,
        user.phone,
        user.city,
        user.street,
        user.postal_code,
    ]
    if not all(field.strip() for field in required):
        raise ValidationError({
            "detail": "Please fill in your shipping details in your profile.",
        })
    
    if not cart_items.exists():
        logger.warning("Order attempt with empty cart by user %s", user.username)
        raise ValidationError(
            {
                "detail": "Your cart is empty."
            }
        )
        
    items_count = cart_items.count()
    
    with transaction.atomic():
        
        order = Order.objects.create(
            user=user,
            shipping_first_name=user.first_name,
            shipping_last_name=user.last_name,
            shipping_phone=user.phone,
            shipping_city=user.city,
            shipping_street=user.street,
            shipping_postal_code=user.postal_code,
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
        
        logger.info(
            "Order %s created by user %s: %s items, total %s",
            order.id, user.username, items_count, total_price
        )
            
    return order

def restore_stock(order):
    for item in order.items.exclude(book_id=None):
        Book.objects.filter(pk=item.book_id).update(
            stock=F("stock") + item.quantity
        )

ADMIN_TRANSITIONS = {
    Order.OrderStatus.PENDING: [Order.OrderStatus.CANCELLED],
    Order.OrderStatus.PAID: [
        Order.OrderStatus.SHIPPED,
        Order.OrderStatus.CANCELLED,
    ],
    Order.OrderStatus.SHIPPED: [Order.OrderStatus.DELIVERED],
}


def pay_order(user, order):
    if order.user_id != user.id:
        raise ValidationError({"detail": "You can only pay for your own order."})

    if order.status != Order.OrderStatus.PENDING:
        raise ValidationError({"detail": "Only a pending order can be paid."})

    order.status = Order.OrderStatus.PAID
    order.save(update_fields=["status", "updated_at"])
    return order


def transition_order(order, new_status):
    allowed = ADMIN_TRANSITIONS.get(order.status, [])
    if new_status not in allowed:
        raise ValidationError({
            "detail": f"Cannot change status from {order.status} to {new_status}.",
        })

    with transaction.atomic():
        order.status = new_status
        order.save(update_fields=["status", "updated_at"])

        if new_status == Order.OrderStatus.CANCELLED:
            restore_stock(order)

    return order
        