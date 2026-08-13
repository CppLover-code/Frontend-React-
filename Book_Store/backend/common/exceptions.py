import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    # DRF handle "its own" exceptions:
    # ValidationError -> 400, NotAuthenticated -> 401, NotFound -> 404...
    response = exception_handler(exc, context)

    if response is not None:
        return response

    # Only an unhandled exception results in a 500 error..
    # logger.exception writes a message + full traceback
    logger.exception(
        "Unhandled exception: %s %s",
        context["request"].method,
        context["request"].path,
    )

    return Response(
        {"detail": "Internal server error."},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )