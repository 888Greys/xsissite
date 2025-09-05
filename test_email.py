#!/usr/bin/env python3
"""
Email Test Script for Production SMTP Configuration
Usage: python test_email.py <recipient_email>
"""

import asyncio
import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

from app.services.email import email_service
from app.core.config import settings

async def test_email_service(recipient_email: str):
    """Test the email service with a simple test email."""
    
    print("🧪 Testing Email Service Configuration")
    print("=" * 50)
    print(f"SMTP Host: {settings.SMTP_HOST}")
    print(f"SMTP Port: {settings.SMTP_PORT}")
    print(f"SMTP Username: {settings.SMTP_USERNAME}")
    print(f"SMTP Use SSL: {settings.SMTP_USE_SSL}")
    print(f"Development Mode: {settings.DEVELOPMENT_MODE}")
    print(f"Recipient: {recipient_email}")
    print("=" * 50)
    
    # Test basic email
    print("\n📧 Testing basic email...")
    test_subject = "Auth System - Email Test"
    test_content = """
    <html>
    <body>
        <h2>Email Test Successful!</h2>
        <p>This is a test email from your Auth System.</p>
        <p>If you received this email, your SMTP configuration is working correctly.</p>
        <p><strong>Configuration Details:</strong></p>
        <ul>
            <li>SMTP Host: {smtp_host}</li>
            <li>SMTP Port: {smtp_port}</li>
            <li>Development Mode: {dev_mode}</li>
        </ul>
    </body>
    </html>
    """.format(
        smtp_host=settings.SMTP_HOST,
        smtp_port=settings.SMTP_PORT,
        dev_mode=settings.DEVELOPMENT_MODE
    )
    
    result = await email_service.send_email(recipient_email, test_subject, test_content)
    
    if result:
        print("✅ Basic email test: SUCCESS")
    else:
        print("❌ Basic email test: FAILED")
        return False
    
    # Test OTP email
    print("\n📧 Testing OTP email...")
    otp_result = await email_service.send_otp_email(recipient_email, "123456", "registration")
    
    if otp_result:
        print("✅ OTP email test: SUCCESS")
    else:
        print("❌ OTP email test: FAILED")
        return False
    
    print("\n🎉 All email tests completed successfully!")
    print("Check your email inbox for the test messages.")
    return True

def main():
    if len(sys.argv) != 2:
        print("Usage: python test_email.py <recipient_email>")
        print("Example: python test_email.py your.email@example.com")
        sys.exit(1)
    
    recipient_email = sys.argv[1]
    
    # Validate email format (basic check)
    if "@" not in recipient_email or "." not in recipient_email:
        print("❌ Invalid email format")
        sys.exit(1)
    
    try:
        # Run the async test
        asyncio.run(test_email_service(recipient_email))
    except KeyboardInterrupt:
        print("\n⚠️ Test interrupted by user")
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()