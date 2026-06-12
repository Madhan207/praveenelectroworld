from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Make email unique and required
    email = models.EmailField(unique=True)
    mobile_number = models.CharField(max_length=15, unique=True)
    name = models.CharField(max_length=255)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'mobile_number', 'name']

    def __str__(self):
        return self.email
