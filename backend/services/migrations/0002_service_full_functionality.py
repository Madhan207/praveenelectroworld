# Generated migration for full service functionality
import django.db.models.deletion
import services.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0001_initial'),
        ('products', '0006_add_service_json_fields'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # ── Drop old ServicePackage (was linked to Service, now linked to Business) ──
        migrations.DeleteModel(name='ServicePackage'),

        # ── Drop old Booking (user was required, now optional) ──
        migrations.DeleteModel(name='Booking'),

        # ── New ServicePackage (Business-level) ──────────────────────────────────────
        migrations.CreateModel(
            name='ServicePackage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('tier', models.CharField(
                    choices=[
                        ('Bronze', 'Bronze'), ('Silver', 'Silver'), ('Gold', 'Gold'),
                        ('Premium', 'Premium'), ('Luxury', 'Luxury'), ('Custom', 'Custom'),
                    ],
                    default='Gold', max_length=20,
                )),
                ('price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('badge', models.CharField(blank=True, help_text="e.g., 'Best Value', 'Popular'", max_length=100)),
                ('duration', models.CharField(blank=True, help_text="e.g., 'Per Event', '8 Hours'", max_length=100)),
                ('features', models.JSONField(default=list, help_text='List of feature strings')),
                ('image_file', models.ImageField(blank=True, null=True, upload_to='packages/')),
                ('is_active', models.BooleanField(default=True)),
                ('order', models.IntegerField(default=0)),
                ('business', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='service_packages', to='products.business',
                )),
            ],
            options={'ordering': ['order', 'price']},
        ),

        # ── GalleryImage ─────────────────────────────────────────────────────────────
        migrations.CreateModel(
            name='GalleryImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image_file', models.ImageField(blank=True, null=True, upload_to='gallery/')),
                ('image_url', models.URLField(blank=True, max_length=1000)),
                ('caption', models.CharField(blank=True, max_length=300)),
                ('category', models.CharField(blank=True, help_text="e.g., 'Wedding', 'Corporate'", max_length=100)),
                ('order', models.IntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('business', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='gallery_images', to='products.business',
                )),
            ],
            options={'ordering': ['order', 'created_at']},
        ),

        # ── Testimonial ───────────────────────────────────────────────────────────────
        migrations.CreateModel(
            name='Testimonial',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('role', models.CharField(blank=True, help_text="e.g., 'Bride', 'HR Manager'", max_length=200)),
                ('comment', models.TextField()),
                ('rating', models.IntegerField(default=5)),
                ('avatar_file', models.ImageField(blank=True, null=True, upload_to='testimonials/')),
                ('avatar_url', models.URLField(blank=True, max_length=1000)),
                ('is_approved', models.BooleanField(default=False)),
                ('order', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('business', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='testimonials', to='products.business',
                )),
            ],
            options={'ordering': ['order', '-created_at']},
        ),

        # ── FAQ ───────────────────────────────────────────────────────────────────────
        migrations.CreateModel(
            name='FAQ',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=500)),
                ('answer', models.TextField()),
                ('order', models.IntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('business', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='faqs', to='products.business',
                )),
            ],
            options={'ordering': ['order'], 'verbose_name': 'FAQ', 'verbose_name_plural': 'FAQs'},
        ),

        # ── AvailabilitySlot ──────────────────────────────────────────────────────────
        migrations.CreateModel(
            name='AvailabilitySlot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('is_available', models.BooleanField(default=True)),
                ('title', models.CharField(blank=True, help_text="e.g., 'Wedding Booked'", max_length=200)),
                ('note', models.TextField(blank=True)),
                ('business', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='availability_slots', to='products.business',
                )),
            ],
            options={'ordering': ['date'], 'unique_together': {('business', 'date')}},
        ),

        # ── Booking (new, with booking_id, guest support) ─────────────────────────────
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('booking_id', models.CharField(default=services.models.generate_booking_id, editable=False, max_length=20, unique=True)),
                ('name', models.CharField(blank=True, max_length=200)),
                ('phone', models.CharField(blank=True, max_length=30)),
                ('email', models.EmailField(blank=True)),
                ('event_type', models.CharField(blank=True, max_length=100)),
                ('guest_count', models.IntegerField(blank=True, null=True)),
                ('booking_date', models.DateField()),
                ('booking_time', models.TimeField(blank=True, null=True)),
                ('location_address', models.TextField(blank=True)),
                ('special_requests', models.TextField(blank=True)),
                ('total_amount', models.DecimalField(decimal_places=2, default=0, max_digits=12)),
                ('status', models.CharField(
                    choices=[
                        ('Pending', 'Pending'), ('Confirmed', 'Confirmed'),
                        ('In Progress', 'In Progress'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled'),
                    ],
                    default='Pending', max_length=20,
                )),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('business', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='bookings', to='products.business',
                )),
                ('service', models.ForeignKey(
                    blank=True, null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='bookings', to='services.service',
                )),
                ('package', models.ForeignKey(
                    blank=True, null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='bookings', to='services.servicepackage',
                )),
                ('user', models.ForeignKey(
                    blank=True, null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='bookings', to=settings.AUTH_USER_MODEL,
                )),
            ],
            options={'ordering': ['-created_at']},
        ),

        # ── QuoteRequest ──────────────────────────────────────────────────────────────
        migrations.CreateModel(
            name='QuoteRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('phone', models.CharField(max_length=30)),
                ('email', models.EmailField(blank=True)),
                ('event_type', models.CharField(blank=True, max_length=100)),
                ('budget', models.CharField(blank=True, max_length=100)),
                ('event_date', models.DateField(blank=True, null=True)),
                ('event_location', models.CharField(blank=True, max_length=500)),
                ('guest_count', models.IntegerField(blank=True, null=True)),
                ('special_requirements', models.TextField(blank=True)),
                ('status', models.CharField(
                    choices=[
                        ('Pending', 'Pending'), ('Replied', 'Replied'),
                        ('Approved', 'Approved'), ('Rejected', 'Rejected'),
                        ('Converted', 'Converted to Booking'),
                    ],
                    default='Pending', max_length=20,
                )),
                ('reply_text', models.TextField(blank=True)),
                ('is_read', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('business', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='quote_requests', to='products.business',
                )),
                ('package_interest', models.ForeignKey(
                    blank=True, null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='quote_requests', to='services.servicepackage',
                )),
                ('booking', models.OneToOneField(
                    blank=True, null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='quote_source', to='services.booking',
                )),
            ],
            options={'ordering': ['-created_at']},
        ),

        # ── ContactInquiry ────────────────────────────────────────────────────────────
        migrations.CreateModel(
            name='ContactInquiry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('phone', models.CharField(blank=True, max_length=30)),
                ('email', models.EmailField(blank=True)),
                ('message', models.TextField()),
                ('is_read', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('business', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='contact_inquiries', to='products.business',
                )),
            ],
            options={'ordering': ['-created_at'], 'verbose_name_plural': 'Contact Inquiries'},
        ),
    ]
