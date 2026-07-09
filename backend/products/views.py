from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Business, Category, Product, ProductImage, Review, Banner
from .serializers import BusinessSerializer, CategorySerializer, ProductSerializer, ReviewSerializer, BannerSerializer
from rest_framework.views import APIView
from django.db.models import Q

class BusinessViewSet(viewsets.ModelViewSet):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'business__name']

    def get_queryset(self):
        queryset = Category.objects.all().select_related('business')
        business_slug = self.request.query_params.get('business', None)
        if business_slug:
            queryset = queryset.filter(business__slug=business_slug)
        return queryset

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'category__name', 'category__business__name', 'brand', 'sku']
    ordering_fields = ['price', 'created_at', 'name']

    def get_queryset(self):
        queryset = Product.objects.all().select_related('category', 'category__business').prefetch_related('images', 'reviews')
        
        # Filters
        category_slug = self.request.query_params.get('category', None)
        business_slug = self.request.query_params.get('business', None)
        is_featured = self.request.query_params.get('is_featured', None)
        is_service = self.request.query_params.get('is_service', None)

        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        if business_slug:
            queryset = queryset.filter(category__business__slug=business_slug)
        if is_featured is not None:
            # Handle string 'true' / 'false'
            is_featured_bool = str(is_featured).lower() == 'true'
            queryset = queryset.filter(is_featured=is_featured_bool)
        if is_service is not None:
            is_service_bool = str(is_service).lower() == 'true'
            queryset = queryset.filter(is_service=is_service_bool)

        return queryset

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def _extract_image(self, request):
        """Pull image file out of request so it doesn't break serializer validation."""
        image_file = request.FILES.get('image') or request.data.get('image')
        # Build a mutable copy of the data without the 'image' key
        data = request.data.dict() if hasattr(request.data, 'dict') else dict(request.data)
        data.pop('image', None)
        return image_file, data

    def create(self, request, *args, **kwargs):
        image_file, data = self._extract_image(request)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        if image_file:
            ProductImage.objects.create(
                product=serializer.instance,
                image_file=image_file,
                is_primary=True
            )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        image_file, data = self._extract_image(request)

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if image_file:
            product_image = instance.images.filter(is_primary=True).first()
            if product_image:
                product_image.image_file = image_file
                product_image.save()
            else:
                ProductImage.objects.create(
                    product=instance,
                    image_file=image_file,
                    is_primary=True
                )

        return Response(serializer.data)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    def get_queryset(self):
        queryset = Banner.objects.all()
        business_slug = self.request.query_params.get('business', None)
        is_global = self.request.query_params.get('global', None)
        
        if is_global == 'true':
            queryset = queryset.filter(business__isnull=True)
        elif business_slug:
            queryset = queryset.filter(business__slug=business_slug)
            
        return queryset

class GlobalSearchView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, *args, **kwargs):
        query = request.query_params.get('q', '')
        if not query:
            return Response({"businesses": [], "categories": [], "products": []})
            
        # Search Businesses
        businesses = Business.objects.filter(
            Q(name__icontains=query) | 
            Q(description__icontains=query) |
            Q(type__icontains=query)
        ).distinct()[:5]
        
        # Search Categories
        categories = Category.objects.filter(
            Q(name__icontains=query)
        ).distinct()[:5]
        
        # Search Products
        products = Product.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(category__name__icontains=query)
        ).distinct()[:20]
        
        return Response({
            "businesses": BusinessSerializer(businesses, many=True).data,
            "categories": CategorySerializer(categories, many=True).data,
            "products": ProductSerializer(products, many=True).data
        })
