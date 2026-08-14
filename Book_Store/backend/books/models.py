from django.db import models

class Author(models.Model):

    name = models.CharField(max_length=150, unique=True)

    def __str__(self):
        return self.name


class Category(models.Model):

    name = models.CharField(max_length=150, unique=True)

    def __str__(self):
        return self.name

class Book(models.Model):

    title = models.CharField(max_length=250)
    authors = models.ManyToManyField(Author)
    categories = models.ManyToManyField(Category)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    cover = models.ImageField(upload_to="books/", blank=True, null=True)
    stock = models.PositiveIntegerField()

    def __str__(self):
        return self.title