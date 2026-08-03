from django.apps import AppConfig

class CartConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "cart"

    # специальный метод, который вызывается при запуске приложения
    # он нужен для того, чтобы зарегистрировать сигналы
    def ready(self):
        import cart.signals