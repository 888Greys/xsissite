from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.user import (
    UserProfileResponse, UserProfileUpdate, ChangePassword, Message,
    AdminUserUpdate, UserListResponse
)
from app.routers.auth import get_current_user
from app.services.auth import AuthService
from app.services.file_upload import file_upload_service
from app.utils.permissions import require_admin, require_moderator_or_admin
from app.models.user import User

router = APIRouter()

@router.get("/profile", response_model=UserProfileResponse)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """Get user profile information."""
    return current_user

@router.put("/profile", response_model=UserProfileResponse)
async def update_user_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile information."""
    auth_service = AuthService(db)
    
    # Convert profile data to dict, excluding None values
    profile_dict = profile_data.dict(exclude_unset=True)
    
    updated_user = auth_service.update_user_profile(current_user, profile_dict)
    return updated_user

@router.post("/change-password", response_model=Message)
async def change_password(
    password_data: ChangePassword,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password."""
    auth_service = AuthService(db)
    
    success = auth_service.change_user_password(
        current_user,
        password_data.current_password,
        password_data.new_password
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    return {"message": "Password changed successfully"}

@router.post("/upload-avatar", response_model=Message)
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload user avatar."""
    auth_service = AuthService(db)
    
    # Delete old avatar if exists
    if current_user.avatar_url:
        file_upload_service.delete_avatar(current_user.avatar_url)
    
    # Save new avatar
    avatar_url = await file_upload_service.save_avatar(file, current_user.id)
    
    # Update user profile with new avatar URL
    auth_service.update_user_profile(current_user, {"avatar_url": avatar_url})
    
    return {"message": "Avatar uploaded successfully"}

@router.delete("/delete-avatar", response_model=Message)
async def delete_avatar(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete user avatar."""
    if not current_user.avatar_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No avatar to delete"
        )
    
    auth_service = AuthService(db)
    
    # Delete avatar file
    file_upload_service.delete_avatar(current_user.avatar_url)
    
    # Update user profile
    auth_service.update_user_profile(current_user, {"avatar_url": None})
    
    return {"message": "Avatar deleted successfully"}

# Admin endpoints
@router.get("/admin/users", response_model=List[UserListResponse])
async def list_all_users(
    skip: int = 0,
    limit: int = 100,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """List all users (Admin only)."""
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.put("/admin/users/{user_id}", response_model=UserListResponse)
async def update_user_admin(
    user_id: int,
    user_update: AdminUserUpdate,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Update user role/status (Admin only)."""
    auth_service = AuthService(db)
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent admin from demoting themselves
    if user.id == admin_user.id and user_update.role and user_update.role != admin_user.role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change your own role"
        )
    
    # Update user
    update_data = user_update.dict(exclude_unset=True)
    updated_user = auth_service.update_user_profile(user, update_data)
    
    return updated_user

@router.delete("/admin/users/{user_id}", response_model=Message)
async def deactivate_user(
    user_id: int,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Deactivate user (Admin only)."""
    auth_service = AuthService(db)
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent admin from deactivating themselves
    if user.id == admin_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate your own account"
        )
    
    # Deactivate user
    auth_service.update_user_profile(user, {"is_active": False})
    
    return {"message": f"User {user.username} deactivated successfully"}