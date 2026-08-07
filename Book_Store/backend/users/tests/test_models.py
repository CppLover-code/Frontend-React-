import pytest

from django.contrib.auth import get_user_model

User = get_user_model()

# ==========================================
# User model
# ==========================================

@pytest.mark.django_db
def test_create_user():
    """
    User should be created successfully.
    """

    user = User.objects.create_user(
        username="testuser",
        email="test@test.com",
        password="password123",
    )

    assert user.username == "testuser"
    assert user.email == "test@test.com"
    assert user.check_password("password123")


@pytest.mark.django_db
def test_create_superuser():
    """
    Superuser should have admin permissions.
    """

    admin = User.objects.create_superuser(
        username="admin",
        email="admin@test.com",
        password="password123",
    )

    assert admin.is_staff is True
    assert admin.is_superuser is True


@pytest.mark.django_db
def test_user_str():
    """
    __str__ should return username.
    """

    user = User.objects.create_user(
        username="john",
        email="john@test.com",
        password="password123",
    )

    assert str(user) == "john"


@pytest.mark.django_db
def test_phone_field():
    """
    Phone number should be saved correctly.
    """

    user = User.objects.create_user(
        username="user",
        email="user@test.com",
        password="password123",
        phone="+995555123456",
    )

    assert user.phone == "+995555123456"