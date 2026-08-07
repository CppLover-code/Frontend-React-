import pytest
from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from books.models import Author, Category, Book
from cart.models import Cart

User = get_user_model()


# --------------------
# API Client
# --------------------

@pytest.fixture
def api_client():
    return APIClient()


# --------------------
# Users
# --------------------

@pytest.fixture
def user():
    return User.objects.create_user(
        username="user",
        email="user@test.com",
        password="12345678",
    )


@pytest.fixture
def admin_user():
    return User.objects.create_superuser(
        username="admin",
        email="admin@test.com",
        password="12345678",
    )


# --------------------
# Books
# --------------------

@pytest.fixture
def author():
    return Author.objects.create(
        name="George Orwell",
    )


@pytest.fixture
def category():
    return Category.objects.create(
        name="Science Fiction",
    )


@pytest.fixture
def book(author, category):
    book = Book.objects.create(
        title="1984",
        description="Dystopian novel",
        price=Decimal("19.99"),
        stock=10,
    )

    book.authors.add(author)
    book.categories.add(category)

    return book


# --------------------
# Cart
# --------------------

@pytest.fixture
def cart(user):
    return Cart.objects.create(user=user)