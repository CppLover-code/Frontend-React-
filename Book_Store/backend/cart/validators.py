from rest_framework.exceptions import ValidationError


def validate_stock(book, quantity):
    if quantity > book.stock:
        raise ValidationError(
            {
                "detail": (
                    f"Only {book.stock} item(s) left in stock."
                )
            }
        )