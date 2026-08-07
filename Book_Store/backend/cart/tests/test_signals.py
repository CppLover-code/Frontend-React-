import pytest

from django.contrib.auth import get_user_model

from cart.models import Cart

User = get_user_model()


# ==========================================
# create_cart signal
# ==========================================

@pytest.mark.django_db
def test_cart_created_after_user_creation():
    """
    Cart should be created automatically after creating a user.
    """

    user = User.objects.create_user(
        username="new_user",
        email="new_user@test.com",
        password="12345678",
    )

    assert Cart.objects.filter(user=user).exists()
    assert Cart.objects.count() == 1


@pytest.mark.django_db
def test_cart_not_created_again_after_user_update():
    """
    Updating user should not create a new cart.
    """

    user = User.objects.create_user(
        username="new_user",
        email="new_user@test.com",
        password="12345678",
    )

    assert Cart.objects.count() == 1

    user.username = "updated_user"
    user.save()

    assert Cart.objects.count() == 1
    assert Cart.objects.get(user=user)