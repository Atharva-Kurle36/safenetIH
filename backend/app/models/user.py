from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: Optional[str] = Field(None, alias="_id")
    created_at: datetime

    class Config:
        populate_by_name = True


class UserInDB(UserBase):
    """User document stored in MongoDB"""
    id: Optional[str] = Field(None, alias="_id")
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password_hash": "$2b$12$...",
                "created_at": "2025-01-01T00:00:00"
            }
        }


class TokenData(BaseModel):
    email: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
