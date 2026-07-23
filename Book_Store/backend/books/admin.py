from django.contrib import admin
from .models import Author, Category, Book

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    pass

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = [
         'title', 
         'get_authors',
         'get_categories',
         'price', 
         'stock',
         ]

    search_fields = [
         'title',
         'authors__name',
         'categories__name',
    ]

    @admin.display(description="Authors")
    def get_authors(self, obj):
        return ", ".join(author.name for author in obj.authors.all())

    @admin.display(description="Categories")
    def get_categories(self, obj):
            return ", ".join(category.name for category in obj.categories.all())

    