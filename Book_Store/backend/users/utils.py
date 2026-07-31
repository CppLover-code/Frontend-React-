from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


def create_auth_response(user, serializer, status_code):
    refresh = RefreshToken.for_user(user)

    response = Response(
        {
            "access": str(refresh.access_token),
            "user": serializer(user).data,
        },
        status=status_code,
    )

    response.set_cookie(
        key="refresh_token",
        value=str(refresh),
        httponly=True,
        secure=False,
        samesite="Lax",
        max_age=60 * 60 * 24 * 7,
    )

    return response