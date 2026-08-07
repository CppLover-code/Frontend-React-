import pytest
from decimal import Decimal

from django.urls import reverse
from rest_framework import status

from books.models import Book


# =====================================================
# GET /books/
# =====================================================

@pytest.mark.django_db
def test_get_books_list(api_client, book):
    """The book list is making a successful comeback."""
    url = reverse("book-list")

    response = api_client.get(url)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_books_list_has_pagination(api_client, book):
    """The response contains pagination fields."""
    url = reverse("book-list")

    response = api_client.get(url)

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data


@pytest.mark.django_db
def test_books_list_returns_one_book(api_client, book):
    """There is one book in the database — the API returns one book."""
    url = reverse("book-list")

    response = api_client.get(url)

    assert response.data["count"] == 1
    assert len(response.data["results"]) == 1


@pytest.mark.django_db
def test_book_list_contains_correct_data(api_client, book):
    """We check the correctness of the book data."""
    url = reverse("book-list")

    response = api_client.get(url)

    data = response.data["results"][0]

    assert data["title"] == "1984"
    assert data["price"] == "19.99"
    assert data["stock"] == 10


# =====================================================
# POST /books/
# =====================================================

@pytest.mark.django_db
def test_admin_can_create_book(admin_client, author, category):
    """The administrator can create a book."""
    url = reverse("book-list")

    data = {
        "title": "Harry Potter",
        "description": "Magic book",
        "price": "29.99",
        "stock": 15,
        "authors": [author.id],
        "categories": [category.id],
    }

    response = admin_client.post(url, data, format="json")

    assert response.status_code == status.HTTP_201_CREATED

    assert Book.objects.filter(title="Harry Potter").exists()

    book = Book.objects.get(title="Harry Potter")

    assert book.price == Decimal("29.99")
    assert book.stock == 15
    assert author in book.authors.all()
    assert category in book.categories.all()


@pytest.mark.django_db
def test_authenticated_user_cannot_create_book(
    authenticated_client,
    author,
    category,
):
    """A regular user cannot create a book."""
    url = reverse("book-list")

    data = {
        "title": "Harry Potter",
        "description": "Magic book",
        "price": "29.99",
        "stock": 15,
        "authors": [author.id],
        "categories": [category.id],
    }

    response = authenticated_client.post(url, data, format="json")

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_guest_cannot_create_book(api_client, author, category):
    """An unauthorized user cannot create a book."""
    url = reverse("book-list")

    data = {
        "title": "Harry Potter",
        "description": "Magic book",
        "price": "29.99",
        "stock": 15,
        "authors": [author.id],
        "categories": [category.id],
    }

    response = api_client.post(url, data, format="json")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


# =====================================================
# PATCH /books/{id}/
# =====================================================

@pytest.mark.django_db
def test_admin_can_update_book(admin_client, book):
    """The administrator can update a book."""
    url = reverse("book-detail", args=[book.id])

    response = admin_client.patch(
        url,
        {
            "price": "49.99",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK

    book.refresh_from_db()

    assert book.price == Decimal("49.99")


# =====================================================
# DELETE /books/{id}/
# =====================================================

@pytest.mark.django_db
def test_admin_can_delete_book(admin_client, book):
    """The administrator can delete a book."""
    url = reverse("book-detail", args=[book.id])

    response = admin_client.delete(url)

    assert response.status_code == status.HTTP_204_NO_CONTENT

    assert not Book.objects.filter(id=book.id).exists()