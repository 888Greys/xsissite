import random
import string
from datetime import datetime, timedelta
from app.core.config import settings

def generate_otp_code() -> str:
    """Generate a 6-digit OTP code."""
    return ''.join(random.choices(string.digits, k=6))

def get_otp_expiry() -> datetime:
    """Get OTP expiry time."""
    return datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)

def is_otp_expired(expires_at: datetime) -> bool:
    """Check if OTP has expired."""
    return datetime.utcnow() > expires_at