import os
import uuid
import aiofiles
from PIL import Image
from fastapi import UploadFile, HTTPException, status
from typing import Optional

class FileUploadService:
    def __init__(self):
        self.upload_dir = "uploads"
        self.avatar_dir = os.path.join(self.upload_dir, "avatars")
        self.max_file_size = 5 * 1024 * 1024  # 5MB
        self.allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
        self.avatar_size = (200, 200)  # Avatar dimensions
        
        # Create directories if they don't exist
        os.makedirs(self.avatar_dir, exist_ok=True)

    def _get_file_extension(self, filename: str) -> str:
        """Get file extension from filename."""
        return os.path.splitext(filename)[1].lower()

    def _generate_unique_filename(self, original_filename: str) -> str:
        """Generate unique filename while preserving extension."""
        extension = self._get_file_extension(original_filename)
        unique_id = str(uuid.uuid4())
        return f"{unique_id}{extension}"

    def _validate_image_file(self, file: UploadFile) -> None:
        """Validate uploaded image file."""
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No filename provided"
            )
        
        extension = self._get_file_extension(file.filename)
        if extension not in self.allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type not allowed. Allowed types: {', '.join(self.allowed_extensions)}"
            )
        
        if file.size and file.size > self.max_file_size:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File too large. Maximum size: {self.max_file_size // (1024*1024)}MB"
            )

    async def save_avatar(self, file: UploadFile, user_id: int) -> str:
        """Save and process avatar image."""
        self._validate_image_file(file)
        
        # Generate unique filename
        filename = self._generate_unique_filename(file.filename)
        file_path = os.path.join(self.avatar_dir, filename)
        
        try:
            # Save uploaded file
            async with aiofiles.open(file_path, 'wb') as f:
                content = await file.read()
                await f.write(content)
            
            # Process image (resize and optimize)
            self._process_avatar_image(file_path)
            
            # Return relative URL path
            return f"/uploads/avatars/{filename}"
            
        except Exception as e:
            # Clean up file if processing failed
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to process avatar: {str(e)}"
            )

    def _process_avatar_image(self, file_path: str) -> None:
        """Process avatar image - resize and optimize."""
        try:
            with Image.open(file_path) as img:
                # Convert to RGB if necessary (for PNG with transparency)
                if img.mode in ('RGBA', 'LA', 'P'):
                    # Create white background
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                    img = background
                
                # Resize image maintaining aspect ratio
                img.thumbnail(self.avatar_size, Image.Resampling.LANCZOS)
                
                # Create square image with white background
                square_img = Image.new('RGB', self.avatar_size, (255, 255, 255))
                
                # Center the image
                x = (self.avatar_size[0] - img.width) // 2
                y = (self.avatar_size[1] - img.height) // 2
                square_img.paste(img, (x, y))
                
                # Save optimized image
                square_img.save(file_path, 'JPEG', quality=85, optimize=True)
                
        except Exception as e:
            raise Exception(f"Image processing failed: {str(e)}")

    def delete_avatar(self, avatar_url: str) -> bool:
        """Delete avatar file."""
        if not avatar_url or not avatar_url.startswith("/uploads/avatars/"):
            return False
        
        # Extract filename from URL
        filename = os.path.basename(avatar_url)
        file_path = os.path.join(self.avatar_dir, filename)
        
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
        except Exception:
            pass
        
        return False

# Global file upload service instance
file_upload_service = FileUploadService()