from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.user import User, OTPCode
from app.schemas.user import UserCreate
from app.utils.auth import get_password_hash, verify_password
from app.utils.otp import generate_otp_code, get_otp_expiry, is_otp_expired
from app.services.email import email_service
from app.core.config import settings

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str) -> User:
        """Get user by email."""
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_username(self, username: str) -> User:
        """Get user by username."""
        return self.db.query(User).filter(User.username == username).first()

    def create_user(self, user_data: UserCreate) -> User:
        """Create new user."""
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password,
            is_active=True,
            is_verified=False
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def authenticate_user(self, username: str, password: str) -> User:
        """Authenticate user with username and password."""
        user = self.get_user_by_username(username)
        if not user:
            return None
        
        # Check if user is locked out
        if user.locked_until and datetime.utcnow() < user.locked_until:
            return None
        
        # Reset failed attempts if lockout period has passed
        if user.locked_until and datetime.utcnow() >= user.locked_until:
            user.failed_login_attempts = 0
            user.locked_until = None
            self.db.commit()
        
        if not verify_password(password, user.hashed_password):
            # Increment failed attempts
            user.failed_login_attempts += 1
            
            # Lock account if max attempts reached
            if user.failed_login_attempts >= settings.MAX_LOGIN_ATTEMPTS:
                user.locked_until = datetime.utcnow() + timedelta(minutes=settings.LOCKOUT_DURATION_MINUTES)
            
            self.db.commit()
            return None
        
        # Reset failed attempts on successful login
        if user.failed_login_attempts > 0:
            user.failed_login_attempts = 0
            self.db.commit()
        
        return user

    async def create_otp_code(self, email: str, purpose: str) -> bool:
        """Create and send OTP code."""
        # Invalidate existing OTP codes for this email and purpose
        self.db.query(OTPCode).filter(
            and_(OTPCode.email == email, OTPCode.purpose == purpose)
        ).update({"is_used": True})
        
        # Generate new OTP
        otp_code = generate_otp_code()
        expires_at = get_otp_expiry()
        
        db_otp = OTPCode(
            email=email,
            code=otp_code,
            purpose=purpose,
            expires_at=expires_at
        )
        self.db.add(db_otp)
        self.db.commit()
        
        # Send email
        return await email_service.send_otp_email(email, otp_code, purpose)

    def verify_otp_code(self, email: str, code: str, purpose: str) -> bool:
        """Verify OTP code."""
        otp_record = self.db.query(OTPCode).filter(
            and_(
                OTPCode.email == email,
                OTPCode.code == code,
                OTPCode.purpose == purpose,
                OTPCode.is_used == False
            )
        ).first()
        
        if not otp_record:
            return False
        
        if is_otp_expired(otp_record.expires_at):
            return False
        
        # Mark OTP as used
        otp_record.is_used = True
        self.db.commit()
        
        return True

    def verify_user_email(self, email: str):
        """Mark user as verified."""
        user = self.get_user_by_email(email)
        if user:
            user.is_verified = True
            self.db.commit()

    def reset_user_password(self, email: str, new_password: str):
        """Reset user password."""
        user = self.get_user_by_email(email)
        if user:
            user.hashed_password = get_password_hash(new_password)
            user.failed_login_attempts = 0
            user.locked_until = None
            self.db.commit()

    def update_user_profile(self, user: User, profile_data: dict) -> User:
        """Update user profile information."""
        for field, value in profile_data.items():
            if hasattr(user, field) and value is not None:
                setattr(user, field, value)
        
        self.db.commit()
        self.db.refresh(user)
        return user

    def change_user_password(self, user: User, current_password: str, new_password: str) -> bool:
        """Change user password after verifying current password."""
        if not verify_password(current_password, user.hashed_password):
            return False
        
        user.hashed_password = get_password_hash(new_password)
        user.failed_login_attempts = 0
        user.locked_until = None
        self.db.commit()
        return True