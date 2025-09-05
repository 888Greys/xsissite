from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user import (
    UserCreate, UserLogin, UserResponse, Token, 
    OTPRequest, OTPVerify, PasswordReset, Message
)
from app.services.auth import AuthService
from app.utils.auth import create_access_token, verify_token
from app.models.user import User

router = APIRouter()
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user."""
    token = credentials.credentials
    email = verify_token(token)
    
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    auth_service = AuthService(db)
    user = auth_service.get_user_by_email(email)
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

@router.post("/register", response_model=Message)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    auth_service = AuthService(db)
    
    # Check if user already exists
    if auth_service.get_user_by_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    if auth_service.get_user_by_username(user_data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create user
    user = auth_service.create_user(user_data)
    
    # Send verification email
    otp_sent = await auth_service.create_otp_code(user.email, "registration")
    
    if not otp_sent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification email"
        )
    
    return {"message": "User registered successfully. Please check your email for verification code."}

@router.post("/verify-email", response_model=Message)
async def verify_email(otp_data: OTPVerify, db: Session = Depends(get_db)):
    """Verify user email with OTP."""
    auth_service = AuthService(db)
    
    # Verify OTP
    if not auth_service.verify_otp_code(otp_data.email, otp_data.code, "registration"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification code"
        )
    
    # Mark user as verified
    auth_service.verify_user_email(otp_data.email)
    
    return {"message": "Email verified successfully"}

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user."""
    auth_service = AuthService(db)
    
    user = auth_service.authenticate_user(user_credentials.username, user_credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password, or account is locked"
        )
    
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please verify your email before logging in"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/forgot-password", response_model=Message)
async def forgot_password(request: OTPRequest, db: Session = Depends(get_db)):
    """Request password reset."""
    auth_service = AuthService(db)
    
    user = auth_service.get_user_by_email(request.email)
    if not user:
        # Don't reveal if email exists or not
        return {"message": "If the email exists, a password reset code has been sent."}
    
    # Send password reset email
    otp_sent = await auth_service.create_otp_code(user.email, "password_reset")
    
    if not otp_sent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send password reset email"
        )
    
    return {"message": "If the email exists, a password reset code has been sent."}

@router.post("/reset-password", response_model=Message)
async def reset_password(reset_data: PasswordReset, db: Session = Depends(get_db)):
    """Reset password with OTP."""
    auth_service = AuthService(db)
    
    # Verify OTP
    if not auth_service.verify_otp_code(reset_data.email, reset_data.code, "password_reset"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset code"
        )
    
    # Reset password
    auth_service.reset_user_password(reset_data.email, reset_data.new_password)
    
    return {"message": "Password reset successfully"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return current_user

@router.post("/resend-verification", response_model=Message)
async def resend_verification(request: OTPRequest, db: Session = Depends(get_db)):
    """Resend verification email."""
    auth_service = AuthService(db)
    
    user = auth_service.get_user_by_email(request.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already verified"
        )
    
    # Send verification email
    otp_sent = await auth_service.create_otp_code(user.email, "registration")
    
    if not otp_sent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification email"
        )
    
    return {"message": "Verification email sent successfully"}