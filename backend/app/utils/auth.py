from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import os

# Password hashing configuration - using argon2id instead of bcrypt due to compatibility issues
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# JWT configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(email: str, expires_delta: Optional[timedelta] = None) -> tuple[str, int]:
    """
    Create a JWT access token
    
    Args:
        email: User email to encode in token
        expires_delta: Optional timedelta for token expiration
        
    Returns:
        Tuple of (token, expires_in_seconds)
    """
    if expires_delta is None:
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    expire = datetime.utcnow() + expires_delta
    to_encode = {"email": email, "exp": expire}
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    # Calculate expires_in for client
    expires_in = int(expires_delta.total_seconds())
    
    return encoded_jwt, expires_in


def verify_token(token: str) -> Optional[str]:
    """
    Verify and decode a JWT token
    
    Args:
        token: JWT token string
        
    Returns:
        Email from token if valid, None if invalid
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        if email is None:
            return None
        return email
    except JWTError:
        return None
