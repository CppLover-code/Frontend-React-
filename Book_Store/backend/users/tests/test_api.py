import pytest

from django.urls import reverse
from rest_framework import status

# ==========================================
# Register
# ==========================================

@pytest.mark.django_db
def test_register(api_client):
    """
    User should be able to register.
    """

    response = api_client.post(
        reverse("register"),
        {
            "username": "newuser",
            "email": "newuser@test.com",
            "password": "password123",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED
    assert "access" in response.data
    assert "user" in response.data
    assert response.data["user"]["username"] == "newuser"


@pytest.mark.django_db
def test_register_duplicate_username(api_client, user):
    """
    Registration with existing username should fail.
    """

    response = api_client.post(
        reverse("register"),
        {
            "username": user.username,
            "email": "another@test.com",
            "password": "password123",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_register_duplicate_email(api_client, user):
    """
    Registration with existing email should fail.
    """

    response = api_client.post(
        reverse("register"),
        {
            "username": "anotheruser",
            "email": user.email,
            "password": "password123",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


# ==========================================
# Login
# ==========================================

@pytest.mark.django_db
def test_login(user, api_client):
    """
    User should be able to login.
    """

    response = api_client.post(
        reverse("login"),
        {
            "username": "user",
            "password": "12345678",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.data
    assert "refresh_token" in response.cookies


@pytest.mark.django_db
def test_login_invalid_password(user, api_client):
    """
    Login should fail with invalid password.
    """

    response = api_client.post(
        reverse("login"),
        {
            "username": "user",
            "password": "wrongpassword",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_login_unknown_user(api_client):
    """
    Login should fail for unknown user.
    """

    response = api_client.post(
        reverse("login"),
        {
            "username": "unknown",
            "password": "12345678",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


# ==========================================
# Current User
# ==========================================

@pytest.mark.django_db
def test_me(authenticated_client):
    """
    Authenticated user should get own profile.
    """

    response = authenticated_client.get(
        reverse("me"),
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["username"] == "user"


@pytest.mark.django_db
def test_me_unauthorized(api_client):
    """
    Anonymous user should not access profile.
    """

    response = api_client.get(
        reverse("me"),
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


# ==========================================
# Refresh Token
# ==========================================

@pytest.mark.django_db
def test_refresh(user, api_client):
    """
    Refresh endpoint should return new access token.
    """

    login = api_client.post(
        reverse("login"),
        {
            "username": "user",
            "password": "12345678",
        },
        format="json",
    )

    api_client.cookies["refresh_token"] = (
        login.cookies["refresh_token"].value
    )

    response = api_client.post(
        reverse("refresh"),
    )

    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.data


@pytest.mark.django_db
def test_refresh_without_cookie(api_client):
    """
    Refresh should fail without refresh cookie.
    """

    response = api_client.post(
        reverse("refresh"),
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


# ==========================================
# Logout
# ==========================================

@pytest.mark.django_db
def test_logout(user, api_client):
    """
    Authenticated user should logout successfully.
    """

    login = api_client.post(
        reverse("login"),
        {
            "username": "user",
            "password": "12345678",
        },
        format="json",
    )

    api_client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {login.data['access']}"
    )

    api_client.cookies["refresh_token"] = (
        login.cookies["refresh_token"].value
    )

    response = api_client.post(
        reverse("logout"),
    )

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_logout_without_cookie(authenticated_client):
    """
    Logout should fail without refresh cookie.
    """

    response = authenticated_client.post(
        reverse("logout"),
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_refresh_after_logout(user, api_client):
    """
    Blacklisted refresh token should not be reusable.
    """

    login = api_client.post(
        reverse("login"),
        {
            "username": "user",
            "password": "12345678",
        },
        format="json",
    )

    refresh_token = login.cookies["refresh_token"].value

    api_client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {login.data['access']}"
    )

    api_client.cookies["refresh_token"] = refresh_token

    logout = api_client.post(
        reverse("logout"),
    )

    assert logout.status_code == status.HTTP_200_OK

    api_client.cookies["refresh_token"] = refresh_token

    response = api_client.post(
        reverse("refresh"),
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    
    
@pytest.mark.django_db
def test_refresh_rotates_token(user, api_client):
    """
    Refresh should set a new refresh cookie (rotation).
    """

    login = api_client.post(
        reverse("login"),
        {
            "username": user.username,
            "password": "12345678",
        },
        format="json",
    )

    old_refresh = login.cookies["refresh_token"].value

    api_client.cookies["refresh_token"] = old_refresh

    response = api_client.post(
        reverse("refresh"),
    )

    assert response.status_code == status.HTTP_200_OK
    assert "refresh_token" in response.cookies
    assert response.cookies["refresh_token"].value != old_refresh


@pytest.mark.django_db
def test_old_refresh_rejected_after_rotation(user, api_client):
    """
    Used refresh token should be blacklisted and rejected.
    """

    login = api_client.post(
        reverse("login"),
        {
            "username": user.username,
            "password": "12345678",
        },
        format="json",
    )

    old_refresh = login.cookies["refresh_token"].value

    api_client.cookies["refresh_token"] = old_refresh

    first = api_client.post(reverse("refresh"))
    assert first.status_code == status.HTTP_200_OK

    # подсовываем старый токен еще раз - должен быть отвергнут
    api_client.cookies["refresh_token"] = old_refresh

    second = api_client.post(reverse("refresh"))
    assert second.status_code == status.HTTP_401_UNAUTHORIZED