from django.urls import path

from .views import (
    CartView, 
    AddToCartView, 
    UpdateCartItemView, 
    DeleteCartItemView,
)

urlpatterns = [
    path("", CartView.as_view(), name="cart"),
    path("add/", AddToCartView.as_view(), name="cart-add"),
    path("item/<int:pk>/", UpdateCartItemView.as_view(), name="cart-item-update"),
    path("item/<int:pk>/delete/", DeleteCartItemView.as_view(), name="cart-item-delete"),
]