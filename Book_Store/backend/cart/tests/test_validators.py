import pytest

from rest_framework.exceptions import ValidationError

from cart.validators import validate_stock


@pytest.mark.django_db
def test_validate_stock_success(book):
    """
    Validation should pass if enough books are in stock.
    """

    validate_stock(book, 5)


@pytest.mark.django_db
def test_validate_stock_equal_stock(book):
    """
    Validation should pass if quantity equals stock.
    """

    validate_stock(book, book.stock)


@pytest.mark.django_db
def test_validate_stock_not_enough(book):
    """
    ValidationError should be raised if quantity exceeds stock.
    """

    with pytest.raises(ValidationError) as exc:
        validate_stock(book, book.stock + 1)

    assert exc.value.detail["detail"] == (
        f"Only {book.stock} item(s) left in stock."
    )