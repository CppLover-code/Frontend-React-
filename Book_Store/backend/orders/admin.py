from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    
    show_change_link = True
    
    readonly_fields = (
        "book",
        "book_title",
        "book_cover",
        "price",
        "quantity",
        "subtotal",
    )
    
    # Disable delete option for OrderItemInline for admin interface.
    can_delete = False
    
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "id", 
        "user", 
        "status", 
        "total_price", 
        "created_at",
        "updated_at",
    ]
    list_filter = [
        "status",
        "created_at",
    ]
    search_fields = [
        "=id",
        "user__email",
    ]
    ordering = [
        "-created_at",
    ]
    inlines = [
        OrderItemInline,
    ]

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "order",
        "book_title",
        "quantity",
        "price",
        "subtotal",
    )

    search_fields = (
        "book_title",
        "order__user__email",
    )

    ordering = (
        "-order__created_at",
    )
    
    readonly_fields = (
    "book",
    "book_title",
    "book_cover",
    "quantity",
    "price",
    "subtotal",
    )
    
    def has_add_permission(self, request):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False