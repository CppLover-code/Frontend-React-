import pytest
from django.db.utils import IntegrityError

from cart.models import Cart, CartItem


# ==========================================
# Cart model
# ==========================================

@pytest.mark.django_db
def test_cart_creation(user):
    """
    Cart should be created automatically when user is created.
    """

    cart = user.cart

    assert cart.user == user
    assert Cart.objects.count() == 1


@pytest.mark.django_db
def test_cart_str(user):
    """
    __str__ should return readable representation.
    """

    cart = user.cart

    assert str(cart) == f"Cart of {user.username}"


# ==========================================
# CartItem model
# ==========================================

@pytest.mark.django_db
def test_cart_item_creation(cart, book):
    """
    CartItem should be created correctly.
    """

    item = CartItem.objects.create(
        cart=cart,
        book=book,
        quantity=2,
    )

    assert item.cart == cart
    assert item.book == book
    assert item.quantity == 2
    assert CartItem.objects.count() == 1


@pytest.mark.django_db
def test_cart_item_default_quantity(cart, book):
    """
    Quantity should be 1 by default.
    """

    item = CartItem.objects.create(
        cart=cart,
        book=book,
    )

    assert item.quantity == 1


@pytest.mark.django_db
def test_cart_item_str(cart, book):
    """
    __str__ should return readable representation.
    """

    item = CartItem.objects.create(
        cart=cart,
        book=book,
        quantity=3,
    )

    assert str(item) == "1984 x 3"


@pytest.mark.django_db
def test_cart_item_unique_constraint(cart, book):
    """
    One book can exist only once inside one cart.
    """

    CartItem.objects.create(
        cart=cart,
        book=book,
        quantity=1,
    )

    with pytest.raises(IntegrityError):
        CartItem.objects.create(
            cart=cart,
            book=book,
            quantity=5,
        )