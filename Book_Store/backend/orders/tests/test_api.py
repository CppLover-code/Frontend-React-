import pytest

from cart.models import CartItem
from orders.models import Order


# ==========================================
# Get orders
# ==========================================

@pytest.mark.django_db
def test_get_orders_list(authenticated_client):
    """
    Authenticated user should receive own orders.
    """

    response = authenticated_client.get("/api/orders/")

    assert response.status_code == 200


@pytest.mark.django_db
def test_get_orders_requires_authentication(api_client):
    """
    Anonymous user should not access orders.
    """

    response = api_client.get("/api/orders/")

    assert response.status_code == 401


# ==========================================
# Create order
# ==========================================

@pytest.mark.django_db
def test_create_order(authenticated_client, user, cart, book):
    """
    Order should be created successfully.
    """

    CartItem.objects.create(
        cart=cart,
        book=book,
        quantity=2,
    )

    response = authenticated_client.post("/api/orders/")

    assert response.status_code == 201
    assert Order.objects.count() == 1

    order = Order.objects.first()

    assert order.user == user
    assert float(order.total_price) == 39.98


@pytest.mark.django_db
def test_create_order_empty_cart(authenticated_client):
    """
    Empty cart should return ValidationError.
    """

    response = authenticated_client.post("/api/orders/")

    assert response.status_code == 400
    assert response.data["detail"] == "Your cart is empty."


# ==========================================
# Retrieve order
# ==========================================

@pytest.mark.django_db
def test_get_single_order(authenticated_client, user):
    """
    User should retrieve own order.
    """

    order = Order.objects.create(user=user)

    response = authenticated_client.get(
        f"/api/orders/{order.id}/"
    )

    assert response.status_code == 200
    assert response.data["id"] == order.id


@pytest.mark.django_db
def test_user_cannot_access_other_order(
    authenticated_client,
    admin_user,
):
    """
    User should not access another user's order.
    """

    order = Order.objects.create(user=admin_user)

    response = authenticated_client.get(
        f"/api/orders/{order.id}/"
    )

    assert response.status_code == 404


# ==========================================
# Admin
# ==========================================

@pytest.mark.django_db
def test_admin_can_view_all_orders(
    admin_client,
    user,
):
    """
    Admin should see all orders.
    """

    Order.objects.create(user=user)
    Order.objects.create(user=user)

    response = admin_client.get("/api/orders/")

    assert response.status_code == 200
    assert response.data["count"] == 2
    assert len(response.data["results"]) == 2


# ==========================================
# Stock validation
# ==========================================

@pytest.mark.django_db
def test_create_order_not_enough_stock(
    authenticated_client,
    cart,
    book,
):
    """
    Creating order with insufficient stock should fail.
    """

    CartItem.objects.create(
        cart=cart,
        book=book,
        quantity=50,
    )

    response = authenticated_client.post("/api/orders/")

    assert response.status_code == 400


# ==========================================
# Cart clearing
# ==========================================

@pytest.mark.django_db
def test_cart_becomes_empty_after_order(
    authenticated_client,
    cart,
    book,
):
    """
    Cart should be cleared after successful order.
    """

    CartItem.objects.create(
        cart=cart,
        book=book,
        quantity=1,
    )

    response = authenticated_client.post("/api/orders/")

    assert response.status_code == 201
    assert cart.items.count() == 0
    
# ==========================================
# Pay order
# ==========================================

@pytest.mark.django_db
def test_create_order_requires_profile(authenticated_client, user, cart, book):
    user.first_name = ""
    user.save(update_fields=["first_name"])

    CartItem.objects.create(cart=cart, book=book, quantity=1)

    response = authenticated_client.post("/api/orders/")

    assert response.status_code == 400


@pytest.mark.django_db
def test_pay_order(authenticated_client, user, cart, book):
    CartItem.objects.create(cart=cart, book=book, quantity=1)
    create = authenticated_client.post("/api/orders/")
    order_id = create.data["id"]

    response = authenticated_client.post(f"/api/orders/{order_id}/pay/")

    assert response.status_code == 200
    assert response.data["status"] == "paid"


@pytest.mark.django_db
def test_user_cannot_ship_order(authenticated_client, user, cart, book):
    CartItem.objects.create(cart=cart, book=book, quantity=1)
    create = authenticated_client.post("/api/orders/")
    authenticated_client.post(f"/api/orders/{create.data['id']}/pay/")

    response = authenticated_client.post(
        f"/api/orders/{create.data['id']}/status/",
        {"status": "shipped"},
        format="json",
    )

    assert response.status_code == 403


@pytest.mark.django_db
def test_admin_can_ship_paid_order(admin_client, user, cart, book):
    from rest_framework.test import APIClient

    buyer = APIClient()
    buyer.force_authenticate(user=user)
    CartItem.objects.create(cart=cart, book=book, quantity=1)
    create = buyer.post("/api/orders/")
    buyer.post(f"/api/orders/{create.data['id']}/pay/")

    response = admin_client.post(
        f"/api/orders/{create.data['id']}/status/",
        {"status": "shipped"},
        format="json",
    )

    assert response.status_code == 200
    assert response.data["status"] == "shipped"
    

@pytest.mark.django_db
def test_cancel_paid_order_restores_stock(admin_client, user, cart, book):
    from rest_framework.test import APIClient

    buyer = APIClient()
    buyer.force_authenticate(user=user)
    CartItem.objects.create(cart=cart, book=book, quantity=2)
    create = buyer.post("/api/orders/")
    buyer.post(f"/api/orders/{create.data['id']}/pay/")

    book.refresh_from_db()
    assert book.stock == 8

    response = admin_client.post(
        f"/api/orders/{create.data['id']}/status/",
        {"status": "cancelled"},
        format="json",
    )

    assert response.status_code == 200
    book.refresh_from_db()
    assert book.stock == 10