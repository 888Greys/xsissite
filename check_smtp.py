#!/usr/bin/env python3
"""
SMTP Connection Checker
Tests SMTP connectivity and authentication
"""

import socket
import ssl
import smtplib
from email.mime.text import MIMEText

def test_smtp_connection(host, port, username, password):
    """Test SMTP connection and authentication"""
    print(f"🔍 Testing SMTP connection to {host}:{port}")
    print(f"📧 Username: {username}")
    print("-" * 50)
    
    try:
        # Test basic connectivity
        print(f"1. Testing basic connectivity to {host}:{port}...")
        sock = socket.create_connection((host, port), timeout=10)
        sock.close()
        print("✅ Basic connectivity: SUCCESS")
        
        # Test SMTP connection
        print(f"2. Testing SMTP connection...")
        
        if port == 465:
            # SSL connection
            print("   Using SSL connection (port 465)")
            server = smtplib.SMTP_SSL(host, port, timeout=10)
        else:
            # Regular connection with STARTTLS
            print(f"   Using STARTTLS connection (port {port})")
            server = smtplib.SMTP(host, port, timeout=10)
            server.starttls()
        
        print("✅ SMTP connection: SUCCESS")
        
        # Test authentication
        print(f"3. Testing authentication...")
        server.login(username, password)
        print("✅ Authentication: SUCCESS")
        
        # Test sending capability
        print(f"4. Testing send capability...")
        msg = MIMEText("Test message from SMTP checker")
        msg['Subject'] = "SMTP Test"
        msg['From'] = username
        msg['To'] = username
        
        server.send_message(msg)
        print("✅ Send capability: SUCCESS")
        
        server.quit()
        print("\n🎉 All SMTP tests passed!")
        return True
        
    except socket.timeout:
        print("❌ Connection timeout - check host/port or firewall")
        return False
    except socket.gaierror as e:
        print(f"❌ DNS resolution failed: {e}")
        return False
    except smtplib.SMTPAuthenticationError as e:
        print(f"❌ Authentication failed: {e}")
        print("💡 Possible solutions:")
        print("   - Check username/password")
        print("   - Enable app passwords")
        print("   - Enable 2FA and use app-specific password")
        print("   - Check if account allows SMTP access")
        return False
    except smtplib.SMTPException as e:
        print(f"❌ SMTP error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def main():
    # Current settings
    host = "mail.spacemail.com"
    port = 465
    username = "support@xsis.online"
    password = "Mathew#7436"
    
    print("🧪 SMTP Configuration Checker")
    print("=" * 50)
    
    # Test current settings
    print("Testing current configuration:")
    success = test_smtp_connection(host, port, username, password)
    
    if not success and port == 465:
        print("\n" + "=" * 50)
        print("Trying alternative port 587 with STARTTLS...")
        success = test_smtp_connection(host, 587, username, password)
    
    if not success:
        print("\n" + "=" * 50)
        print("🔧 Troubleshooting suggestions:")
        print("1. Verify email account credentials")
        print("2. Check if email provider requires app passwords")
        print("3. Ensure SMTP is enabled for the account")
        print("4. Try different SMTP settings from your email provider")
        print("5. Check firewall/network restrictions")

if __name__ == "__main__":
    main()