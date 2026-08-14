from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError

from books.models import Book
from .models import CartItem
from .validators import validate_stock


def add_book_to_cart(user, book_id, quantity):
    cart = user.cart

    book = get_object_or_404(Book, pk=book_id)

    validate_stock(book, quantity)

    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        book=book,
        defaults={
            "quantity": quantity,
        },
    )

    if not created:
        new_quantity = cart_item.quantity + quantity

        validate_stock(book, new_quantity)

        cart_item.quantity = new_quantity
        cart_item.save()

    return cart

def update_cart_item(user, cart_item_id, quantity):
    cart_item = get_object_or_404(
        CartItem,
        pk=cart_item_id,
        cart=user.cart,
    )

    validate_stock(cart_item.book, quantity)
    
    cart_item.quantity = quantity
    cart_item.save()

    return user.cart

def change_cart_item_quantity(user, cart_item_id, delta):

    """
    Atomically change item quantity by `delta` (e.g. +1 / -1).

    The row is locked with select_for_update, so two concurrent
    requests are applied one after another instead of overwriting
    each other (read-modify-write race).
    Dropping quantity to zero (or below) removes the item.
    """

    with transaction.atomic():
        cart_item = get_object_or_404(
            CartItem.objects.select_for_update().select_related("book"),
            pk=cart_item_id,
            cart=user.cart,
        )

        new_quantity = cart_item.quantity + delta

        if new_quantity <= 0:
            cart_item.delete()
            return user.cart

        validate_stock(cart_item.book, new_quantity)

        cart_item.quantity = new_quantity
        cart_item.save()

    return user.cart

def delete_cart_item(user, cart_item_id):
    cart_item = get_object_or_404(
        CartItem,
        pk=cart_item_id,
        cart=user.cart,
    )

    cart_item.delete()

    return user.cart

def clear_cart(user):
    
    """
    Remove all items from user's cart.
    """
    
    cart = user.cart

    cart.items.all().delete()

    return cart