import pytest

from rest_framework.exceptions import ValidationError

from cart.models import CartItem
from cart.services import (
    add_book_to_cart,
    update_cart_item,
    change_cart_item_quantity,
    delete_cart_item,
    clear_cart,
)


# ==========================================
# add_book_to_cart
# ==========================================

@pytest.mark.django_db
def test_add_book_to_cart(user, book):
    """
    Book should be added into cart.
    """

    cart = add_book_to_cart(
        user=user,
        book_id=book.id,
        quantity=2,
    )

    assert cart == user.cart

    item = CartItem.objects.get()

    assert item.book == book
    assert item.quantity == 2


@pytest.mark.django_db
def test_add_existing_book_increases_quantity(user, book):
    """
    Existing cart item should increase quantity.
    """

    add_book_to_cart(
        user=user,
        book_id=book.id,
        quantity=2,
    )

    add_book_to_cart(
        user=user,
        book_id=book.id,
        quantity=3,
    )

    item = CartItem.objects.get()

    assert CartItem.objects.count() == 1
    assert item.quantity == 5


@pytest.mark.django_db
def test_add_book_not_enough_stock(user, book):
    """
    ValidationError should be raised if stock is exceeded.
    """

    with pytest.raises(ValidationError):
        add_book_to_cart(
            user=user,
            book_id=book.id,
            quantity=book.stock + 1,
        )


# ==========================================
# update_cart_item
# ==========================================

@pytest.mark.django_db
def test_update_cart_item(user, book):
    """
    Quantity should be updated.
    """

    item = CartItem.objects.create(
        cart=user.cart,
        book=book,
        quantity=1,
    )

    update_cart_item(
        user=user,
        cart_item_id=item.id,
        quantity=5,
    )

    item.refresh_from_db()

    assert item.quantity == 5


@pytest.mark.django_db
def test_update_cart_item_not_enough_stock(user, book):
    """
    ValidationError should be raised if quantity exceeds stock.
    """

    item = CartItem.objects.create(
        cart=user.cart,
        book=book,
        quantity=1,
    )

    with pytest.raises(ValidationError):
        update_cart_item(
            user=user,
            cart_item_id=item.id,
            quantity=book.stock + 1,
        )


# ==========================================
# change_cart_item_quantity
# ==========================================

@pytest.mark.django_db
def test_change_quantity_increments(user, book):
    """
    Positive delta should increase quantity.
    """

    item = CartItem.objects.create(
        cart=user.cart,
        book=book,
        quantity=2,
    )

    change_cart_item_quantity(
        user=user,
        cart_item_id=item.id,
        delta=1,
    )

    item.refresh_from_db()

    assert item.quantity == 3


@pytest.mark.django_db
def test_change_quantity_to_zero_removes_item(user, book):
    """
    Dropping quantity to zero should remove the item.
    """

    item = CartItem.objects.create(
        cart=user.cart,
        book=book,
        quantity=1,
    )

    change_cart_item_quantity(
        user=user,
        cart_item_id=item.id,
        delta=-1,
    )

    assert CartItem.objects.count() == 0


@pytest.mark.django_db
def test_change_quantity_not_enough_stock(user, book):
    """
    ValidationError should be raised if new quantity exceeds stock.
    """

    item = CartItem.objects.create(
        cart=user.cart,
        book=book,
        quantity=book.stock,
    )

    with pytest.raises(ValidationError):
        change_cart_item_quantity(
            user=user,
            cart_item_id=item.id,
            delta=1,
        )


# ==========================================
# delete_cart_item
# ==========================================

@pytest.mark.django_db
def test_delete_cart_item(user, book):
    """
    Cart item should be removed.
    """

    item = CartItem.objects.create(
        cart=user.cart,
        book=book,
        quantity=2,
    )

    delete_cart_item(
        user=user,
        cart_item_id=item.id,
    )

    assert CartItem.objects.count() == 0


# ==========================================
# clear_cart
# ==========================================

@pytest.mark.django_db
def test_clear_cart(user, book, second_book):
    """
    All cart items should be removed.
    """

    CartItem.objects.create(
        cart=user.cart,
        book=book,
        quantity=2,
    )

    CartItem.objects.create(
        cart=user.cart,
        book=second_book,
        quantity=1,
    )

    clear_cart(user)

    assert CartItem.objects.count() == 0