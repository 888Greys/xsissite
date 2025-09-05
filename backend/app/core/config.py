from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://auth_user:auth_password_2024@localhost:5432/auth_db"
    
    # JWT
    SECRET_KEY: str = "your-super-secret-jwt-key-change-in-production-2024-secure"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # SMTP
    SMTP_HOST: str = "mail.spacemail.com"
    SMTP_PORT: int = 465
    SMTP_USERNAME: str = "support@xsis.online"
    SMTP_PASSWORD: str
    SMTP_USE_SSL: bool = True
    
    # Frontend
    FRONTEND_URL: str = "https://pom.xsis.online"
    
    # OTP
    OTP_EXPIRE_MINUTES: int = 10
    MAX_LOGIN_ATTEMPTS: int = 5
    LOCKOUT_DURATION_MINUTES: int = 30
    
    # Production Settings
    DEVELOPMENT_MODE: bool = False
    SKIP_EMAIL_VERIFICATION: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Initialize settings
settings = Settings()

# Debug logging for production deployment
print(f"🔧 Configuration loaded:")
print(f"   DEVELOPMENT_MODE: {settings.DEVELOPMENT_MODE}")
print(f"   SMTP_HOST: {settings.SMTP_HOST}")
print(f"   SMTP_PORT: {settings.SMTP_PORT}")
print(f"   SMTP_USERNAME: {settings.SMTP_USERNAME}")
print(f"   FRONTEND_URL: {settings.FRONTEND_URL}")
print(f"   DATABASE_URL: {settings.DATABASE_URL[:50]}...")
