from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError

from books.models import Book
from .models import CartItem


def add_book_to_cart(user, book_id, quantity):
    cart = user.cart

    book = get_object_or_404(Book, pk=book_id)

    if quantity > book.stock:
        raise ValidationError(
            {
                "detail": f"Only {book.stock} item(s) left in stock."
            }
        )

    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        book=book,
        defaults={
            "quantity": quantity,
        },
    )

    if not created:
        new_quantity = cart_item.quantity + quantity

        if new_quantity > book.stock:
            raise ValidationError(
                {
                    "detail": f"Only {book.stock} item(s) left in stock."
                }
            )

        cart_item.quantity = new_quantity
        cart_item.save()

    return cart