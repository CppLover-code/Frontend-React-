from django.db import models
from django.conf import settings
from books.models import Book

class Order(models.Model):
    class OrderStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        SHIPPED = "shipped", "Shipped"
        DELIVERED = "delivered", "Delivered"
        CANCELLED = "cancelled", "Cancelled"
        
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name="orders",
        )
    
    status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING,
        )
    
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        )
    
    shipping_first_name = models.CharField(max_length=150, blank=True)
    shipping_last_name = models.CharField(max_length=150, blank=True)
    shipping_phone = models.CharField(max_length=15, blank=True)
    shipping_city = models.CharField(max_length=100, blank=True)
    shipping_street = models.CharField(max_length=200, blank=True)
    shipping_postal_code = models.CharField(max_length=20, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Order {self.id} - {self.user.username}"

class OrderItem(models.Model):
    
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
        )
    
    book = models.ForeignKey(
        Book,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="order_items",
        )
    
    book_title = models.CharField(
        max_length=255
        )
    
    book_cover = models.ImageField(
        upload_to="book_covers/", 
        null=True, 
        blank=True
        )
    
    quantity = models.PositiveIntegerField()
    
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        )
    
    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        )
    
    def __str__(self):
        return f"OrderItem {self.id} - {self.book_title}"
   