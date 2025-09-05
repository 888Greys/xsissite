import aiosmtplib
import smtplib
import asyncio
from concurrent.futures import ThreadPoolExecutor
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Template
from app.core.config import settings

class EmailService:
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_username = settings.SMTP_USERNAME
        self.smtp_password = settings.SMTP_PASSWORD
        self.smtp_use_ssl = settings.SMTP_USE_SSL

    async def send_email(self, to_email: str, subject: str, html_content: str):
        """Send email using SMTP."""
        # In development mode, just log the email instead of sending
        if settings.DEVELOPMENT_MODE:
            print(f"[DEV MODE] Email to {to_email}")
            print(f"[DEV MODE] Subject: {subject}")
            print(f"[DEV MODE] Content: {html_content}")
            return True
        
        print(f"📧 [PRODUCTION] Sending email to: {to_email}")
        print(f"📧 [PRODUCTION] Subject: {subject}")
        print(f"📧 [PRODUCTION] SMTP Config: {self.smtp_host}:{self.smtp_port}")
            
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = self.smtp_username
        message["To"] = to_email

        html_part = MIMEText(html_content, "html")
        message.attach(html_part)

        try:
            print(f"📧 [PRODUCTION] Attempting to connect to SMTP server...")
            
            # Use aiosmtplib with proper SSL configuration for port 465
            if self.smtp_port == 465:
                print(f"📧 [PRODUCTION] Using SSL connection (port 465)")
                
                # Create SMTP client with SSL
                smtp_client = aiosmtplib.SMTP(
                    hostname=self.smtp_host,
                    port=self.smtp_port,
                    use_tls=True,
                    validate_certs=False,  # Some servers have certificate issues
                    timeout=30
                )
                
                await smtp_client.connect()
                await smtp_client.login(self.smtp_username, self.smtp_password)
                await smtp_client.send_message(message)
                await smtp_client.quit()
                
                print(f"✅ [PRODUCTION] Email sent successfully via SSL (port 465)")
                return True
            else:
                # For other ports, use STARTTLS
                print(f"📧 [PRODUCTION] Using STARTTLS connection (port {self.smtp_port})")
                
                smtp_client = aiosmtplib.SMTP(
                    hostname=self.smtp_host,
                    port=self.smtp_port,
                    timeout=30
                )
                
                await smtp_client.connect()
                await smtp_client.starttls(validate_certs=False)
                await smtp_client.login(self.smtp_username, self.smtp_password)
                await smtp_client.send_message(message)
                await smtp_client.quit()
                
                print(f"✅ [PRODUCTION] Email sent successfully via STARTTLS")
                return True
            
        except Exception as e:
            print(f"⚠️ [PRODUCTION] aiosmtplib failed: {str(e)}")
            print(f"📧 [PRODUCTION] Trying fallback with standard smtplib...")
            
            # Fallback to standard smtplib in thread pool
            try:
                loop = asyncio.get_event_loop()
                with ThreadPoolExecutor() as executor:
                    result = await loop.run_in_executor(
                        executor, 
                        self._send_email_sync, 
                        message, 
                        to_email
                    )
                    return result
            except Exception as fallback_error:
                print(f"❌ [PRODUCTION] All SMTP attempts failed for {to_email}")
                print(f"❌ [PRODUCTION] aiosmtplib error: {str(e)}")
                print(f"❌ [PRODUCTION] smtplib fallback error: {str(fallback_error)}")
                
                # Provide helpful troubleshooting info
                print(f"🔧 [PRODUCTION] Troubleshooting info:")
                print(f"   - SMTP Host: {self.smtp_host}")
                print(f"   - SMTP Port: {self.smtp_port}")
                print(f"   - Username: {self.smtp_username}")
                print(f"   - Check if email account allows app passwords")
                print(f"   - Verify SMTP credentials are correct")
                
                return False

    def _send_email_sync(self, message, to_email: str):
        """Synchronous email sending using standard smtplib (fallback method)."""
        print(f"📧 [PRODUCTION] Using smtplib fallback for {to_email}")
        
        try:
            if self.smtp_port == 465:
                # SSL connection
                print(f"📧 [PRODUCTION] smtplib: Using SSL connection (port 465)")
                server = smtplib.SMTP_SSL(self.smtp_host, self.smtp_port, timeout=30)
            else:
                # STARTTLS connection
                print(f"📧 [PRODUCTION] smtplib: Using STARTTLS connection (port {self.smtp_port})")
                server = smtplib.SMTP(self.smtp_host, self.smtp_port, timeout=30)
                server.starttls()
            
            server.login(self.smtp_username, self.smtp_password)
            server.send_message(message)
            server.quit()
            
            print(f"✅ [PRODUCTION] Email sent successfully via smtplib fallback")
            return True
            
        except Exception as e:
            print(f"❌ [PRODUCTION] smtplib fallback also failed: {str(e)}")
            raise e

    async def send_otp_email(self, to_email: str, otp_code: str, purpose: str):
        """Send OTP verification email."""
        if purpose == "registration":
            subject = "Verify Your Account - OTP Code"
            template_content = """
            <html>
            <body>
                <h2>Welcome to Auth System!</h2>
                <p>Your verification code is: <strong>{{ otp_code }}</strong></p>
                <p>This code will expire in {{ expire_minutes }} minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            </body>
            </html>
            """
        else:  # password_reset
            subject = "Password Reset - OTP Code"
            template_content = """
            <html>
            <body>
                <h2>Password Reset Request</h2>
                <p>Your password reset code is: <strong>{{ otp_code }}</strong></p>
                <p>This code will expire in {{ expire_minutes }} minutes.</p>
                <p>If you didn't request this reset, please ignore this email.</p>
            </body>
            </html>
            """

        template = Template(template_content)
        html_content = template.render(
            otp_code=otp_code,
            expire_minutes=settings.OTP_EXPIRE_MINUTES
        )

        return await self.send_email(to_email, subject, html_content)

# Global email service instance
email_service = EmailService()