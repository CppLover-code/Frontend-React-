import pytest
from decimal import Decimal

from orders.models import Order, OrderItem


# ==========================================
# Order model
# ==========================================

@pytest.mark.django_db
def test_order_creation(user):
    """
    Order should be created successfully.
    """

    order = Order.objects.create(
        user=user,
        total_price=Decimal("99.99"),
    )

    assert order.user == user
    assert order.status == Order.OrderStatus.PENDING
    assert order.total_price == Decimal("99.99")
    assert Order.objects.count() == 1


@pytest.mark.django_db
def test_order_default_status(user):
    """
    Default status should be PENDING.
    """

    order = Order.objects.create(user=user)

    assert order.status == Order.OrderStatus.PENDING


@pytest.mark.django_db
def test_order_str(user):
    """
    __str__ should return readable representation.
    """

    order = Order.objects.create(user=user)

    assert str(order) == f"Order {order.id} - {user.username}"


# ==========================================
# OrderItem model
# ==========================================

@pytest.mark.django_db
def test_order_item_creation(user, book):
    """
    OrderItem should be created correctly.
    """

    order = Order.objects.create(
        user=user,
    )

    item = OrderItem.objects.create(
        order=order,
        book=book,
        book_title=book.title,
        book_cover=book.cover,
        quantity=2,
        price=book.price,
        subtotal=Decimal("39.98"),
    )

    assert item.order == order
    assert item.book == book
    assert item.book_title == book.title
    assert item.quantity == 2
    assert item.price == book.price
    assert item.subtotal == Decimal("39.98")


@pytest.mark.django_db
def test_order_item_str(user, book):
    """
    __str__ should return readable representation.
    """

    order = Order.objects.create(user=user)

    item = OrderItem.objects.create(
        order=order,
        book=book,
        book_title=book.title,
        book_cover=book.cover,
        quantity=1,
        price=book.price,
        subtotal=book.price,
    )

    assert str(item) == f"OrderItem {item.id} - {book.title}"


@pytest.mark.django_db
def test_order_delete_cascade(user, book):
    """
    Deleting Order should delete its OrderItems.
    """

    order = Order.objects.create(user=user)

    OrderItem.objects.create(
        order=order,
        book=book,
        book_title=book.title,
        book_cover=book.cover,
        quantity=1,
        price=book.price,
        subtotal=book.price,
    )

    assert OrderItem.objects.count() == 1

    order.delete()

    assert OrderItem.objects.count() == 0


@pytest.mark.django_db
def test_book_delete_sets_null(user, book):
    """
    Deleting Book should set OrderItem.book to NULL.
    """

    order = Order.objects.create(user=user)

    item = OrderItem.objects.create(
        order=order,
        book=book,
        book_title=book.title,
        book_cover=book.cover,
        quantity=1,
        price=book.price,
        subtotal=book.price,
    )

    book.delete()

    item.refresh_from_db()

    assert item.book is None
    assert item.book_title == "1984"