from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer
from django.contrib.auth.hashers import check_password

User = get_user_model()


# ================= REGISTER =================
@api_view(['POST'])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "User registered successfully",
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ================= CURRENT USER =================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "username": user.username,
    })

# ================= UPDATE PROFILE =================
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    
    user = request.user
    data = request.data
    user.first_name = data.get("first_name", user.first_name)
    user.last_name = data.get("last_name", user.last_name)
    user.email = data.get("email", user.email)
    user.save()
    return Response({
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "username": user.username,
    })

# ================= CHANGE PASSWORD =================
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    user = request.user
    current = request.data.get("current")
    new = request.data.get("new")

    if not check_password(current, user.password):
        return Response({"error": "Current password is incorrect"}, status=400)

    user.set_password(new)
    user.save()
    return Response({"success": "Password changed", "access": "new_access_token_here", "refresh": "new_refresh_token_here"})