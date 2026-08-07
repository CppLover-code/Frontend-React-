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

@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def admin_client(api_client, admin_user):
    api_client.force_authenticate(user=admin_user)
    return api_client


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

# --------------------
# Additional books
# --------------------

@pytest.fixture
def second_author():
    return Author.objects.create(
        name="J. K. Rowling",
    )


@pytest.fixture
def second_category():
    return Category.objects.create(
        name="Fantasy",
    )


@pytest.fixture
def second_book(second_author, second_category):
    book = Book.objects.create(
        title="Harry Potter",
        description="Wizard school",
        price=Decimal("39.99"),
        stock=5,
    )

    book.authors.add(second_author)
    book.categories.add(second_category)

    return book


@pytest.fixture
def third_book(author, category):
    book = Book.objects.create(
        title="Animal Farm",
        description="Political satire",
        price=Decimal("9.99"),
        stock=25,
    )

    book.authors.add(author)
    book.categories.add(category)

    return book