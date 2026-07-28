from django.urls import path
from .views import BookListAPIView, BookDetailAPIView

urlpatterns = [
    path("books/", BookListAPIView.as_view(), name="Book-list"),
    path("books/<int:pk>/", BookDetailAPIView.as_view(), name="Book-detail",)
]