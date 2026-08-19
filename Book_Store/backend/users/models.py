from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)
    city = models.CharField(max_length=100, blank=True)
    street = models.CharField(max_length=200, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    
    def __str__(self):
        return self.username
    