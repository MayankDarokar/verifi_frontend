"""Validation utilities for user inputs in VeriFi."""

from urllib.parse import urlparse


def validate_text_input(text: str) -> bool:
    """Check that the text input is non-empty and has meaningful length."""
    return bool(text and len(text.strip()) >= 3)


def validate_url(url: str) -> bool:
    """Basic URL validation ensuring scheme and netloc exist."""
    if not url or not url.strip():
        return False
    try:
        url_to_test = url.strip()
        if not (url_to_test.startswith("http://") or url_to_test.startswith("https://")):
            url_to_test = "https://" + url_to_test
        result = urlparse(url_to_test)
        return bool(result.netloc and "." in result.netloc)
    except Exception:
        return False


def validate_qr_image(filename: str) -> bool:
    """Validate that the uploaded file has a valid image extension."""
    if not filename:
        return False
    valid_exts = {"png", "jpg", "jpeg", "webp", "gif", "bmp"}
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    return ext in valid_exts