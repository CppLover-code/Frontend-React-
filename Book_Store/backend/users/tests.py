from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthenticationTests(APITestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@gmail.com",
            password="testpass123",
        )
    
    def test_login(self):
        url = reverse("login")
        response = self.client.post(
            url,
            {
                "username": "testuser",
                "password": "testpass123",
            },
            format="json",
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
    
    def test_blacklisted_refresh_token(self):
        # login
        login_response = self.client.post(
            reverse("login"),
            {
                "username": "testuser",
                "password": "testpass123",
            },
            format="json",
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        
        # Проверяем, что Cookie появилась
        self.assertIn("refresh_token", login_response.cookies)
        
        refresh_cookie = login_response.cookies["refresh_token"].value
        
        # Авторизуемся Access Token
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}",
        )
        
        # Подставляем Refresh Cookie
        self.client.cookies["refresh_token"] = refresh_cookie

        # Logout
        logout_response = self.client.post(reverse("logout"))
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)

        # Используем старую Cookie снова
        self.client.cookies["refresh_token"] = refresh_cookie
        refresh_response = self.client.post(reverse("refresh"))
        self.assertEqual(refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)