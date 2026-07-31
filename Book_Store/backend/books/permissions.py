from rest_framework.permissions import BasePermission, SAFE_METHODS

class AllowEveryone(BasePermission):
    def has_permission(self, request, view):
        return True
    
class DenyEveryone(BasePermission):
    def has_permission(self, request, view):
        return False
    
class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        
        return request.user.is_staff
    