import pytest

from cart.models import CartItem


# ==========================================
# GET Cart
# ==========================================

@pytest.mark.django_db
def test_get_cart(authenticated_client):
    """
    Authenticated user should get own cart.
    """

    response = authenticated_client.get("/api/cart/")

    assert response.status_code == 200
    assert "items" in response.data
    assert "total_items" in response.data
    assert "total_price" in response.data


# ==========================================
# Add book
# ==========================================

@pytest.mark.django_db
def test_add_book_to_cart(authenticated_client, book):
    """
    User can add book to cart.
    """

    response = authenticated_client.post(
        "/api/cart/add/",
        {
            "book_id": book.id,
            "quantity": 2,
        },
        format="json",
    )

    assert response.status_code == 200

    assert CartItem.objects.count() == 1

    item = CartItem.objects.first()

    assert item.book == book
    assert item.quantity == 2


# ==========================================
# Update quantity
# ==========================================

@pytest.mark.django_db
def test_update_cart_item(authenticated_client, user, book):
    """
    User can change quantity.
    """

    cart = user.cart

    item = CartItem.objects.create(
        cart=cart,
        book=book,
        quantity=1,
    )

    response = authenticated_client.patch(
        f"/api/cart/item/{item.id}/",
        {
            "quantity": 5,
        },
        format="json",
    )

    assert response.status_code == 200

    item.refresh_from_db()

    assert item.quantity == 5


# ==========================================
# Delete item
# ==========================================

@pytest.mark.django_db
def test_delete_cart_item(authenticated_client, user, book):
    """
    User can delete item.
    """

    cart = user.cart

    item = CartItem.objects.create(
        cart=cart,
        book=book,
        quantity=3,
    )

    response = authenticated_client.delete(
        f"/api/cart/item/{item.id}/delete/"
    )

    assert response.status_code == 200

    assert CartItem.objects.count() == 0


# ==========================================
# Clear cart
# ==========================================

@pytest.mark.django_db
def test_clear_cart(authenticated_client, user, book, second_book):
    """
    User can clear whole cart.
    """

    cart = user.cart

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

    response = authenticated_client.delete(
        "/api/cart/clear/"
    )

    assert response.status_code == 200
    assert CartItem.objects.count() == 0


# ==========================================
# Unauthorized
# ==========================================

@pytest.mark.django_db
def test_cart_requires_authentication(api_client):
    """
    Anonymous user cannot access cart.
    """

    response = api_client.get("/api/cart/")

    assert response.status_code == 401


@pytest.mark.django_db
def test_add_book_requires_authentication(api_client, book):
    """
    Anonymous user cannot add books.
    """

    response = api_client.post(
        "/api/cart/add/",
        {
            "book_id": book.id,
            "quantity": 1,
        },
        format="json",
    )

    assert response.status_code == 401


@pytest.mark.django_db
def test_update_requires_authentication(api_client, user, book):
    """
    Anonymous user cannot update cart.
    """

    item = CartItem.objects.create(
        cart=user.cart,
        book=book,
        quantity=1,
    )

    response = api_client.patch(
        f"/api/cart/item/{item.id}/",
        {
            "quantity": 5,
        },
        format="json",
    )

    assert response.status_code == 401


@pytest.mark.django_db
def test_delete_requires_authentication(api_client, user, book):
    """
    Anonymous user cannot delete cart item.
    """

    item = CartItem.objects.create(
        cart=user.cart,
        book=book,
        quantity=1,
    )

    response = api_client.delete(
        f"/api/cart/item/{item.id}/delete/"
    )

    assert response.status_code == 401