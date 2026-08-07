import pytest
from decimal import Decimal


@pytest.mark.django_db
def test_book_creation(book):
    assert book.title == "1984"
    assert book.description == "Dystopian novel"
    assert book.price == Decimal("19.99")
    assert book.stock == 10

@pytest.mark.django_db
def test_book_str(book):
    assert str(book) == "1984"
    
@pytest.mark.django_db
def test_book_relations(book):
    assert book.authors.count() == 1
    assert book.categories.count() == 1

    assert book.authors.first().name == "George Orwell"
    assert book.categories.first().name == "Science Fiction"