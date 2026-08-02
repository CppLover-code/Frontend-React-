from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    
    class Meta:
        
        model = Book
        fields = "__all__"
        
    def get_cover(self, obj):
        request = self.context.get("request")

        if obj.cover and request:
            return request.build_absolute_uri(obj.cover.url)

        return None