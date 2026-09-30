from django.urls import path
from rest_framework_simplejwt.views import(
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, UserProfileView, AdminCheckView, AdminUserListView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='auth_profile'),
    path('admin-check/', AdminCheckView.as_view(), name='admin_check'),
    path('admin/users/', AdminUserListView.as_view(), name='admin_users'),
]