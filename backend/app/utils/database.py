from pymongo.collection import Collection
from app.models.user import User, UserInDB
from app.utils.security import hash_password
from datetime import datetime
from bson.objectid import ObjectId
from app.services.mongo_client import get_db


async def get_user_by_email(email: str) -> dict:
    """Get user from MongoDB by email."""
    db = await get_db()
    user = await db.users.find_one({"email": email})
    return user


async def get_user_by_id(user_id: str) -> dict:
    """Get user from MongoDB by ID."""
    db = await get_db()
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        return user
    except Exception:
        return None


async def create_user(email: str, password: str) -> dict:
    """Create a new user in MongoDB."""
    db = await get_db()
    
    # Check if user already exists
    existing_user = await get_user_by_email(email)
    if existing_user:
        return None
    
    # Create new user
    hashed_password = hash_password(password)
    user_data = {
        "email": email,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_data)
    user_data["_id"] = result.inserted_id
    return user_data


async def verify_user(email: str, password: str):
    """Verify user credentials and return user if valid."""
    from app.utils.security import verify_password
    
    user = await get_user_by_email(email)
    if not user:
        return None
    
    if not verify_password(password, user["hashed_password"]):
        return None
    
    return user
