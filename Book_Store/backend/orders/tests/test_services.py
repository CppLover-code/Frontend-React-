import pytest
from decimal import Decimal

from orders.models import Order, OrderItem
from orders.serializers import (
    OrderSerializer,
    OrderItemSerializer,
    CreateOrderSerializer,
)


# ==========================================
# OrderItemSerializer
# ==========================================

@pytest.mark.django_db
def test_order_item_serializer(user, book):
    """
    OrderItemSerializer should serialize all fields correctly.
    """

    order = Order.objects.create(user=user)

    item = OrderItem.objects.create(
        order=order,
        book=book,
        book_title=book.title,
        book_cover=book.cover,
        quantity=2,
        price=book.price,
        subtotal=Decimal("39.98"),
    )

    data = OrderItemSerializer(item).data

    assert data["id"] == item.id
    assert data["book_title"] == book.title
    assert data["quantity"] == 2
    assert Decimal(data["price"]) == Decimal("19.99")
    assert Decimal(data["subtotal"]) == Decimal("39.98")


# ==========================================
# OrderSerializer
# ==========================================

@pytest.mark.django_db
def test_order_serializer(user, book):
    """
    OrderSerializer should serialize order with nested items.
    """

    order = Order.objects.create(
        user=user,
        total_price=Decimal("39.98"),
    )

    OrderItem.objects.create(
        order=order,
        book=book,
        book_title=book.title,
        book_cover=book.cover,
        quantity=2,
        price=book.price,
        subtotal=Decimal("39.98"),
    )

    data = OrderSerializer(order).data

    assert data["id"] == order.id
    assert data["status"] == Order.OrderStatus.PENDING
    assert Decimal(data["total_price"]) == Decimal("39.98")
    assert len(data["items"]) == 1


@pytest.mark.django_db
def test_order_serializer_empty_items(user):
    """
    Serializer should return empty items list.
    """

    order = Order.objects.create(user=user)

    data = OrderSerializer(order).data

    assert data["items"] == []


# ==========================================
# CreateOrderSerializer
# ==========================================

@pytest.mark.django_db
def test_create_order_serializer_valid():
    """
    Empty serializer should always be valid.
    """

    serializer = CreateOrderSerializer(data={})

    assert serializer.is_valid()
    assert serializer.validated_data == {}