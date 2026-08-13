from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Cart


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_cart(sender, instance, created, raw=False, **kwargs):

    if created and raw:
        return

    if created:
        Cart.objects.create(user=instance)