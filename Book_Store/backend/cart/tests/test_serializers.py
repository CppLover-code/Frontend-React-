import pytest
from decimal import Decimal

from cart.models import CartItem
from cart.serializers import (
    CartItemSerializer,
    CartSerializer,
    AddToCartSerializer,
    UpdateCartItemSerializer,
)


# ==========================================
# CartItemSerializer
# ==========================================

@pytest.mark.django_db
def test_cart_item_serializer(cart, book):
    """
    CartItemSerializer should serialize cart item correctly.
    """

    item = CartItem.objects.create(
        cart=cart,
        book=book,
        quantity=2,
    )

    serializer = CartItemSerializer(item)
    data = serializer.data

    assert data["quantity"] == 2
    assert Decimal(data["subtotal"]) == Decimal("39.98")
    assert data["book"]["title"] == "1984"


# ==========================================
# CartSerializer
# ==========================================

@pytest.mark.django_db
def test_cart_serializer(cart, book, second_book):
    """
    CartSerializer should serialize cart with totals.
    """

    CartItem.objects.create(
        cart=cart,
        book=book,
        quantity=2,
    )

    CartItem.objects.create(
        cart=cart,
        book=second_book,
        quantity=1,
    )

    serializer = CartSerializer(cart)
    data = serializer.data

    assert data["total_items"] == 3
    assert Decimal(data["total_price"]) == Decimal("79.97")
    assert len(data["items"]) == 2


@pytest.mark.django_db
def test_empty_cart_serializer(cart):
    """
    Empty cart should return zero totals.
    """

    serializer = CartSerializer(cart)
    data = serializer.data

    assert data["items"] == []
    assert data["total_items"] == 0
    assert Decimal(data["total_price"]) == Decimal("0")


# ==========================================
# AddToCartSerializer
# ==========================================

def test_add_to_cart_serializer_valid():
    """
    Serializer should accept valid data.
    """

    serializer = AddToCartSerializer(
        data={
            "book_id": 1,
            "quantity": 2,
        }
    )

    assert serializer.is_valid()
    assert serializer.validated_data["book_id"] == 1
    assert serializer.validated_data["quantity"] == 2


def test_add_to_cart_serializer_invalid_quantity():
    """
    Quantity must be greater than zero.
    """

    serializer = AddToCartSerializer(
        data={
            "book_id": 1,
            "quantity": 0,
        }
    )

    assert not serializer.is_valid()
    assert "quantity" in serializer.errors


# ==========================================
# UpdateCartItemSerializer
# ==========================================

def test_update_cart_item_serializer_valid():
    """
    Serializer should accept valid quantity.
    """

    serializer = UpdateCartItemSerializer(
        data={
            "quantity": 5,
        }
    )

    assert serializer.is_valid()
    assert serializer.validated_data["quantity"] == 5


def test_update_cart_item_serializer_invalid_quantity():
    """
    Quantity must be greater than zero.
    """

    serializer = UpdateCartItemSerializer(
        data={
            "quantity": -1,
        }
    )

    assert not serializer.is_valid()
    assert "quantity" in serializer.errors