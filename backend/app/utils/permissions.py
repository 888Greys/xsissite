from functools import wraps
from fastapi import HTTPException, status, Depends
from app.models.user import User
from app.schemas.user import UserRole
from app.routers.auth import get_current_user

def require_role(required_role: UserRole):
    """Decorator to require specific user role."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Get current user from kwargs (injected by FastAPI)
            current_user = None
            for key, value in kwargs.items():
                if isinstance(value, User):
                    current_user = value
                    break
            
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            if not has_permission(current_user.role, required_role):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Insufficient permissions. {required_role.value} role required."
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

def has_permission(user_role: UserRole, required_role: UserRole) -> bool:
    """Check if user role has permission for required role."""
    role_hierarchy = {
        UserRole.USER: 1,
        UserRole.MODERATOR: 2,
        UserRole.ADMIN: 3
    }
    
    return role_hierarchy.get(user_role, 0) >= role_hierarchy.get(required_role, 0)

def require_admin(current_user: User = Depends(get_current_user)):
    """Dependency to require admin role."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

def require_moderator_or_admin(current_user: User = Depends(get_current_user)):
    """Dependency to require moderator or admin role."""
    if current_user.role not in ["moderator", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Moderator or Admin access required"
        )
    return current_user