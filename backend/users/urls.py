from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, ProfileView, LoginView, CreateAdminView,
    AddressViewSet, WishlistViewSet, UpdateUserRoleView, AuditLogListView,
    UserListView, ToggleUserActiveView
)

router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='auth_profile'),
    path('create-admin/', CreateAdminView.as_view(), name='create_admin'),
    path('users/', UserListView.as_view(), name='user_list'),
    path('users/<int:pk>/role/', UpdateUserRoleView.as_view(), name='update_user_role'),
    path('users/<int:pk>/toggle-active/', ToggleUserActiveView.as_view(), name='toggle_user_active'),
    path('audit-logs/', AuditLogListView.as_view(), name='audit_logs'),
]
