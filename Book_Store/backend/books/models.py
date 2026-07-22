from django.db import models

class Author(models.Model):

    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name


class Category(models.Model):

    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name