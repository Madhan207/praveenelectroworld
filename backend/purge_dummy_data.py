import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.db import transaction
from users.models import User
from orders.models import Order, Cart
from products.models import Review

def purge_data():
    with transaction.atomic():
        print("Purging unwanted data...")
        Order.objects.all().delete()
        Cart.objects.all().delete()
        Review.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()
        print("Successfully deleted all fake users, orders, carts, and reviews.")
        print(f"Remaining Users (Admins): {User.objects.count()}")

if __name__ == "__main__":
    purge_data()
