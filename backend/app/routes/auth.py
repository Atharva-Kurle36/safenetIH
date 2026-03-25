from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import EmailStr
from app.models.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.utils.auth import hash_password, verify_password, create_access_token, verify_token
from app.services.mongo_client import get_users_collection
import re

router = APIRouter(prefix="/auth", tags=["authentication"])


def validate_password(password: str) -> None:
    """Validate password strength"""
    if len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )
    if not re.search(r"[A-Z]", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one uppercase letter"
        )
    if not re.search(r"[0-9]", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one digit"
        )


def get_current_user(token: str) -> str:
    """Dependency to get current user from JWT token"""
    if not token or not token.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Remove "Bearer " prefix
    token_str = token[7:]
    email = verify_token(token_str)
    
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return email


@router.post("/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate):
    """
    User signup endpoint
    
    - **email**: User email address (must be unique)
    - **password**: User password (min 8 chars, 1 uppercase, 1 digit)
    """
    # Validate password
    validate_password(user_data.password)
    
    users_collection = await get_users_collection()
    
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and store user
    password_hash = hash_password(user_data.password)
    
    result = await users_collection.insert_one({
        "email": user_data.email,
        "password_hash": password_hash,
        "created_at": __import__("datetime").datetime.utcnow()
    })
    
    # Auto-login by creating token
    token, expires_in = create_access_token(user_data.email)
    
    return TokenResponse(
        access_token=token,
        expires_in=expires_in
    )


@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    """
    User login endpoint
    
    - **email**: User email address
    - **password**: User password
    
    Returns JWT access token with 1-hour expiry
    """
    users_collection = await get_users_collection()
    
    # Find user by email
    user = await users_collection.find_one({"email": user_data.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create and return token
    token, expires_in = create_access_token(user_data.email)
    
    return TokenResponse(
        access_token=token,
        expires_in=expires_in
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(authorization: str = None):
    """
    Get current user information (protected route)
    
    Requires: Authorization header with "Bearer <token>"
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email = get_current_user(authorization)
    users_collection = await get_users_collection()
    
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=str(user.get("_id")),
        email=user["email"],
        created_at=user["created_at"]
    )
