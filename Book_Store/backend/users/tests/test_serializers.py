import pytest

from django.contrib.auth import get_user_model

from users.serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
)

User = get_user_model()

# ==========================================
# RegisterSerializer
# ==========================================

@pytest.mark.django_db
def test_register_serializer_create_user():
    """
    RegisterSerializer should create a new user.
    """

    serializer = RegisterSerializer(
        data={
            "username": "newuser",
            "email": "new@test.com",
            "password": "password123",
        }
    )

    assert serializer.is_valid()

    user = serializer.save()

    assert user.username == "newuser"
    assert user.email == "new@test.com"
    assert user.check_password("password123")


@pytest.mark.django_db
def test_register_serializer_invalid_email():
    """
    Serializer should reject invalid email.
    """

    serializer = RegisterSerializer(
        data={
            "username": "newuser",
            "email": "invalid-email",
            "password": "password123",
        }
    )

    assert not serializer.is_valid()
    assert "email" in serializer.errors


@pytest.mark.django_db
def test_register_serializer_missing_password():
    """
    Password is required.
    """

    serializer = RegisterSerializer(
        data={
            "username": "newuser",
            "email": "new@test.com",
        }
    )

    assert not serializer.is_valid()
    assert "password" in serializer.errors


# ==========================================
# UserSerializer
# ==========================================

@pytest.mark.django_db
def test_user_serializer():
    """
    UserSerializer should serialize user fields.
    """

    user = User.objects.create_user(
        username="user",
        email="user@test.com",
        password="password123",
    )

    data = UserSerializer(user).data

    assert data["id"] == user.id
    assert data["username"] == "user"
    assert data["email"] == "user@test.com"


# ==========================================
# LoginSerializer
# ==========================================

@pytest.mark.django_db
def test_login_serializer():
    """
    LoginSerializer should authenticate valid user.
    """

    User.objects.create_user(
        username="user",
        email="user@test.com",
        password="password123",
    )

    serializer = LoginSerializer(
        data={
            "username": "user",
            "password": "password123",
        }
    )

    assert serializer.is_valid()
    assert serializer.validated_data["user"].username == "user"


@pytest.mark.django_db
def test_login_serializer_invalid_password():
    """
    Serializer should reject invalid password.
    """

    User.objects.create_user(
        username="user",
        email="user@test.com",
        password="password123",
    )

    serializer = LoginSerializer(
        data={
            "username": "user",
            "password": "wrongpassword",
        }
    )

    assert not serializer.is_valid()


@pytest.mark.django_db
def test_login_serializer_unknown_user():
    """
    Serializer should reject unknown user.
    """

    serializer = LoginSerializer(
        data={
            "username": "unknown",
            "password": "password123",
        }
    )

    assert not serializer.is_valid()