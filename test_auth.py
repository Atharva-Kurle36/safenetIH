import sys
import os
sys.path.insert(0, r'c:\Users\91930\Desktop\IndustrialHackathon2026\SafeNet-\backend')

# Test the auth directly
import asyncio
from app.services.mongo_client import mongo_connection, get_users_collection
from app.utils.auth import hash_password, create_access_token

async def test_signup():
    print("Testing MongoDB Connection...")
    status = mongo_connection.status()
    print(f"MongoDB Status: {status}")
    
    if not status.get("mongo_connected"):
        print("ERROR: MongoDB not connected!")
        return
    
    print("\nTesting user collection...")
    users_coll = await get_users_collection()
    print(f"Users collection: {users_coll}")
    
    # Test inserting a user
    print("\nTesting user insertion...")
    hashed_pwd = hash_password("Password123")
    print(f"Hashed password: {hashed_pwd[:50]}...")
    
    test_user = {
        "email": "test_direct@example.com",
        "password_hash": hashed_pwd,
        "created_at": __import__('datetime').datetime.utcnow()
    }
    
    result = await users_coll.insert_one(test_user)
    print(f"Inserted user ID: {result.inserted_id}")
    
    # Test finding user
    print("\nTesting user retrieval...")
    found_user = await users_coll.find_one({"email": "test_direct@example.com"})
    print(f"Found user: {found_user}")
    
    # Test token creation
    print("\nTesting token creation...")
    token, expires_in = create_access_token("test_direct@example.com")
    print(f"Token: {token[:50]}...")
    print(f"Expires in: {expires_in} seconds")
    
    print("\n✓ All tests passed!")

if __name__ == "__main__":
    asyncio.run(test_signup())
