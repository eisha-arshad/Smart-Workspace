from django.urls import path
from .views import register_view, current_user, update_profile_view, change_password_view

urlpatterns = [
    path('register/', register_view),
    path('me/', current_user),                # ← add this line
    path('update/', update_profile_view),
    path('change-password/', change_password_view),
]