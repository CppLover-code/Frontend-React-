from django_filters import rest_framework as filters
from .models import Book


class BookFilter(filters.FilterSet):
    
    authors = filters.NumberFilter(field_name="authors")
    
    categories = filters.NumberFilter(field_name="categories")
    
    min_price = filters.NumberFilter(
        field_name="price",
        lookup_expr="gte",
    )

    max_price = filters.NumberFilter(
        field_name="price",
        lookup_expr="lte",
    )

    class Meta:
        model = Book
        fields = [
            "authors",
            "categories",
            "min_price",
            "max_price",
        ]
        
