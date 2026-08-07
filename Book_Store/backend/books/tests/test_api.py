import pytest
from rest_framework import status
from django.urls import reverse


@pytest.mark.django_db
def test_get_books_list(api_client, book):
    url = reverse("book-list")

    response = api_client.get(url)

    assert response.status_code == status.HTTP_200_OK