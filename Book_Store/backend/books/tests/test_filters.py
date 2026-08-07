import pytest

from decimal import Decimal
from django.urls import reverse
from rest_framework import status

from books.models import Book


# ------------------------------------
# Search
# ------------------------------------

@pytest.mark.django_db
def test_search_by_title(api_client, author, category):
    """
    Search book by title.
    """

    book = Book.objects.create(
        title="Harry Potter",
        description="Magic book",
        price=Decimal("29.99"),
        stock=10,
    )
    book.authors.add(author)
    book.categories.add(category)

    url = reverse("book-list")

    response = api_client.get(url, {"search": "Harry"})

    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == 1
    assert response.data["results"][0]["title"] == "Harry Potter"


@pytest.mark.django_db
def test_search_by_description(api_client, author, category):
    """
    Search book by description.
    """

    book = Book.objects.create(
        title="Book",
        description="Interesting fantasy world",
        price=Decimal("19.99"),
        stock=10,
    )
    book.authors.add(author)
    book.categories.add(category)

    url = reverse("book-list")

    response = api_client.get(url, {"search": "fantasy"})

    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == 1


# ------------------------------------
# Filtering
# ------------------------------------

@pytest.mark.django_db
def test_filter_by_author(api_client, author, category):
    """
    Filter books by author.
    """

    book = Book.objects.create(
        title="1984",
        description="Novel",
        price=Decimal("19.99"),
        stock=10,
    )

    book.authors.add(author)
    book.categories.add(category)

    url = reverse("book-list")

    response = api_client.get(url, {
        "authors": author.id,
    })

    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == 1


@pytest.mark.django_db
def test_filter_by_category(api_client, author, category):
    """
    Filter books by category.
    """

    book = Book.objects.create(
        title="1984",
        description="Novel",
        price=Decimal("19.99"),
        stock=10,
    )

    book.authors.add(author)
    book.categories.add(category)

    url = reverse("book-list")

    response = api_client.get(url, {
        "categories": category.id,
    })

    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == 1


@pytest.mark.django_db
def test_filter_by_min_price(api_client, author, category):
    """
    Filter books by minimum price.
    """

    cheap = Book.objects.create(
        title="Cheap",
        description="Book",
        price=Decimal("10.00"),
        stock=10,
    )

    expensive = Book.objects.create(
        title="Expensive",
        description="Book",
        price=Decimal("50.00"),
        stock=10,
    )

    cheap.authors.add(author)
    cheap.categories.add(category)

    expensive.authors.add(author)
    expensive.categories.add(category)

    url = reverse("book-list")

    response = api_client.get(url, {
        "min_price": 30,
    })

    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == 1
    assert response.data["results"][0]["title"] == "Expensive"


@pytest.mark.django_db
def test_filter_by_max_price(api_client, author, category):
    """
    Filter books by maximum price.
    """

    cheap = Book.objects.create(
        title="Cheap",
        description="Book",
        price=Decimal("10.00"),
        stock=10,
    )

    expensive = Book.objects.create(
        title="Expensive",
        description="Book",
        price=Decimal("50.00"),
        stock=10,
    )

    cheap.authors.add(author)
    cheap.categories.add(category)

    expensive.authors.add(author)
    expensive.categories.add(category)

    url = reverse("book-list")

    response = api_client.get(url, {
        "max_price": 20,
    })

    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == 1
    assert response.data["results"][0]["title"] == "Cheap"


# ------------------------------------
# Ordering
# ------------------------------------

@pytest.mark.django_db
def test_order_by_price(api_client, author, category):
    """
    Sort books by price.
    """

    cheap = Book.objects.create(
        title="Cheap",
        description="Book",
        price=Decimal("10.00"),
        stock=10,
    )

    expensive = Book.objects.create(
        title="Expensive",
        description="Book",
        price=Decimal("50.00"),
        stock=10,
    )

    cheap.authors.add(author)
    cheap.categories.add(category)

    expensive.authors.add(author)
    expensive.categories.add(category)

    url = reverse("book-list")

    response = api_client.get(url, {
        "ordering": "price",
    })

    assert response.status_code == status.HTTP_200_OK
    assert response.data["results"][0]["title"] == "Cheap"


@pytest.mark.django_db
def test_order_by_price_desc(api_client, author, category):
    """
    Sort books by price descending.
    """

    cheap = Book.objects.create(
        title="Cheap",
        description="Book",
        price=Decimal("10.00"),
        stock=10,
    )

    expensive = Book.objects.create(
        title="Expensive",
        description="Book",
        price=Decimal("50.00"),
        stock=10,
    )

    cheap.authors.add(author)
    cheap.categories.add(category)

    expensive.authors.add(author)
    expensive.categories.add(category)

    url = reverse("book-list")

    response = api_client.get(url, {
        "ordering": "-price",
    })

    assert response.status_code == status.HTTP_200_OK
    assert response.data["results"][0]["title"] == "Expensive"


@pytest.mark.django_db
def test_order_by_stock(api_client, author, category):
    """
    Sort books by stock.
    """

    first = Book.objects.create(
        title="Book 1",
        description="Book",
        price=Decimal("10.00"),
        stock=5,
    )

    second = Book.objects.create(
        title="Book 2",
        description="Book",
        price=Decimal("10.00"),
        stock=50,
    )

    first.authors.add(author)
    first.categories.add(category)

    second.authors.add(author)
    second.categories.add(category)

    url = reverse("book-list")

    response = api_client.get(url, {
        "ordering": "stock",
    })

    assert response.status_code == status.HTTP_200_OK
    assert response.data["results"][0]["stock"] == 5