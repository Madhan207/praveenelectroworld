from django.core.management.base import BaseCommand
from products.models import Category, Product, ProductImage


PRODUCT_IMAGE_URLS = {
    'smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    'audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    'home-appliances': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    'electrical': 'https://images.unsplash.com/photo-1621905251189-08b45249e1b7?w=600&q=80',
}


class Command(BaseCommand):
    help = 'Seeds the database with fake products and categories'

    def handle(self, *args, **kwargs):
        ProductImage.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()

        # Create categories
        cats = {}
        for slug, name in [
            ('smartphones', 'Smartphones'),
            ('audio', 'Audio Systems'),
            ('home-appliances', 'Home Appliances'),
            ('electrical', 'Electrical'),
        ]:
            cat = Category.objects.create(name=name, slug=slug)
            cats[slug] = cat
            self.stdout.write(self.style.SUCCESS(f"Category: {name}"))

        products_data = [
            # Smartphones
            {'cat': 'smartphones', 'name': 'Samsung Galaxy S25 Ultra', 'slug': 'samsung-galaxy-s25-ultra', 'price': 129999, 'discount': 119999, 'stock': 25, 'featured': True, 'rating': 4.8, 'desc': 'The pinnacle of Android. S25 Ultra features a 200MP camera, titanium frame, and the new Snapdragon 8 Elite chip.'},
            {'cat': 'smartphones', 'name': 'iPhone 16 Pro Max', 'slug': 'iphone-16-pro-max', 'price': 159900, 'discount': None, 'stock': 18, 'featured': True, 'rating': 4.9, 'desc': 'The ultimate iPhone with A18 Pro chip, 48MP Fusion Camera, and Action Button.'},
            {'cat': 'smartphones', 'name': 'OnePlus 13', 'slug': 'oneplus-13', 'price': 69999, 'discount': 64999, 'stock': 40, 'featured': True, 'rating': 4.6, 'desc': 'Hasselblad triple camera, 6000mAh battery, and 100W SuperVOOC charging.'},
            {'cat': 'smartphones', 'name': 'Google Pixel 9 Pro', 'slug': 'google-pixel-9-pro', 'price': 109999, 'discount': 99999, 'stock': 15, 'featured': False, 'rating': 4.7, 'desc': 'The smartest Google phone ever with Gemini AI built in.'},
            {'cat': 'smartphones', 'name': 'Realme GT 6T 5G', 'slug': 'realme-gt-6t-5g', 'price': 35999, 'discount': 32999, 'stock': 60, 'featured': False, 'rating': 4.4, 'desc': 'Snapdragon 7s Gen 3, 5500mAh battery, and 120W charging.'},
            {'cat': 'smartphones', 'name': 'Xiaomi 14 Ultra', 'slug': 'xiaomi-14-ultra', 'price': 99999, 'discount': 94999, 'stock': 20, 'featured': False, 'rating': 4.7, 'desc': 'Leica quad camera system with 1-inch main sensor.'},
            # Audio
            {'cat': 'audio', 'name': 'Sony WH-1000XM5 Headphones', 'slug': 'sony-wh-1000xm5', 'price': 29990, 'discount': 26490, 'stock': 80, 'featured': True, 'rating': 4.9, 'desc': 'Industry-leading noise cancellation with 30-hour battery life and crystal clear calls.'},
            {'cat': 'audio', 'name': 'Apple AirPods Pro 2nd Gen', 'slug': 'apple-airpods-pro-2', 'price': 24900, 'discount': 22900, 'stock': 50, 'featured': True, 'rating': 4.8, 'desc': 'H2 chip, Adaptive Transparency, and Personalized Spatial Audio.'},
            {'cat': 'audio', 'name': 'Bose QuietComfort 45', 'slug': 'bose-qc45', 'price': 24500, 'discount': 21990, 'stock': 30, 'featured': True, 'rating': 4.7, 'desc': 'Legendary Bose noise cancellation with up to 24 hours battery.'},
            {'cat': 'audio', 'name': 'JBL Charge 5 Speaker', 'slug': 'jbl-charge-5', 'price': 16999, 'discount': 14999, 'stock': 100, 'featured': False, 'rating': 4.5, 'desc': 'Waterproof portable speaker with 20 hours playtime and powerbank feature.'},
            {'cat': 'audio', 'name': 'Sennheiser HD 560S', 'slug': 'sennheiser-hd-560s', 'price': 14990, 'discount': None, 'stock': 25, 'featured': False, 'rating': 4.6, 'desc': 'Open-back audiophile headphones for studio-quality listening.'},
            {'cat': 'audio', 'name': 'Boat Airdopes 141', 'slug': 'boat-airdopes-141', 'price': 1299, 'discount': 899, 'stock': 500, 'featured': False, 'rating': 4.2, 'desc': 'True Wireless earbuds with 42H total playtime at a budget price.'},
            # Home Appliances
            {'cat': 'home-appliances', 'name': 'LG 1.5 Ton 5 Star AI Dual Inverter AC', 'slug': 'lg-15-ton-5star-ac', 'price': 45990, 'discount': 42990, 'stock': 30, 'featured': True, 'rating': 4.7, 'desc': 'Super Convertible 6-in-1 Cooling, AI+IoT, HD Filter with Anti-Virus Protection.'},
            {'cat': 'home-appliances', 'name': 'Samsung 324L Frost Free Refrigerator', 'slug': 'samsung-324l-fridge', 'price': 34990, 'discount': 29990, 'stock': 15, 'featured': True, 'rating': 4.5, 'desc': 'Twin Cooling Plus, SpaceMax Technology, and Digital Inverter Compressor.'},
            {'cat': 'home-appliances', 'name': 'IFB 7kg 5 Star Front Load Washing Machine', 'slug': 'ifb-7kg-washing-machine', 'price': 32990, 'discount': 28990, 'stock': 20, 'featured': True, 'rating': 4.6, 'desc': '3D Wash System, Cradle Wash, and Inbuilt Heater for hygienic clean.'},
            {'cat': 'home-appliances', 'name': 'Philips Air Fryer XXL 7.3L', 'slug': 'philips-air-fryer-xxl', 'price': 13995, 'discount': 10995, 'stock': 45, 'featured': False, 'rating': 4.4, 'desc': 'Rapid Air Technology, 7.3L XXL capacity, up to 90% less fat.'},
            {'cat': 'home-appliances', 'name': 'Dyson V15 Detect Vacuum', 'slug': 'dyson-v15-detect', 'price': 62900, 'discount': 55900, 'stock': 10, 'featured': False, 'rating': 4.8, 'desc': 'Laser dust detection, 60-minute runtime, and HEPA filtration.'},
            {'cat': 'home-appliances', 'name': 'Whirlpool 25L Microwave Oven', 'slug': 'whirlpool-25l-microwave', 'price': 10990, 'discount': 8990, 'stock': 35, 'featured': False, 'rating': 4.3, 'desc': 'Jet Defrost, Steam Clean, and 10-year warranty on magnetron.'},
            # Electrical
            {'cat': 'electrical', 'name': 'Havells Modular Switch (6-Module Board)', 'slug': 'havells-6-module-switch', 'price': 1299, 'discount': 999, 'stock': 500, 'featured': True, 'rating': 4.5, 'desc': 'Premium polycarbonate finish, 16A heavy duty switches, shock-proof.'},
            {'cat': 'electrical', 'name': 'Philips 10W LED Bulb Pack of 4', 'slug': 'philips-10w-led-bulbs-4', 'price': 599, 'discount': 449, 'stock': 1000, 'featured': True, 'rating': 4.6, 'desc': 'Energy efficient, 1000 lumen brightness, 15,000 hours lifespan.'},
            {'cat': 'electrical', 'name': 'Syska 5A Extension Board 3m', 'slug': 'syska-extension-board-3m', 'price': 799, 'discount': 599, 'stock': 300, 'featured': True, 'rating': 4.4, 'desc': 'Surge protection, child-safe shutters, and 3-meter flat cord.'},
            {'cat': 'electrical', 'name': 'Anchor Roma Smart Wifi Switch', 'slug': 'anchor-roma-wifi-switch', 'price': 3499, 'discount': 2999, 'stock': 150, 'featured': False, 'rating': 4.3, 'desc': 'Works with Alexa and Google Home. App controlled smart home switch.'},
            {'cat': 'electrical', 'name': 'Legrand 16A 3-Pin Power Socket', 'slug': 'legrand-16a-socket', 'price': 450, 'discount': None, 'stock': 800, 'featured': False, 'rating': 4.5, 'desc': 'International quality, ISI marked, and flame retardant housing.'},
            {'cat': 'electrical', 'name': 'Crompton Greaves 48W LED Tube Light', 'slug': 'crompton-48w-led-tube', 'price': 699, 'discount': 549, 'stock': 600, 'featured': False, 'rating': 4.4, 'desc': 'Flicker free, cool daylight 6500K, suitable for commercial use.'},
        ]

        for pd in products_data:
            p = Product.objects.create(
                category=cats[pd['cat']],
                name=pd['name'],
                slug=pd['slug'],
                description=pd['desc'],
                price=pd['price'],
                discount_price=pd.get('discount'),
                stock=pd['stock'],
                is_featured=pd['featured'],
                rating=pd['rating'],
            )
            # Add an image URL (stored as URL-based path)
            img_url = PRODUCT_IMAGE_URLS[pd['cat']]
            ProductImage.objects.create(product=p, image=img_url, is_primary=True)
            self.stdout.write(self.style.SUCCESS(f"  + {p.name}"))

        self.stdout.write(self.style.SUCCESS(f"\nSeeded {len(products_data)} products across 4 categories!"))
