from __future__ import annotations

import os
from typing import Any

from pymongo.errors import PyMongoError

try:
    from motor.motor_asyncio import AsyncIOMotorClient
except Exception:
    AsyncIOMotorClient = None


class MongoConnection:
    def __init__(self) -> None:
        self.uri = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
        self.db_name = os.getenv("MONGO_DB_NAME", "safenet")
        self.client: Any | None = None
        self.db: object | None = None
        self.enabled = False

    async def connect(self) -> None:
        """Connect to MongoDB"""
        if AsyncIOMotorClient is None:
            print("MongoDB async driver (motor) is not installed; running without MongoDB")
            self.client = None
            self.db = None
            self.enabled = False
            return

        try:
            self.client = AsyncIOMotorClient(self.uri, serverSelectionTimeoutMS=2000)
            await self.client.admin.command("ping")
            self.db = self.client[self.db_name]
            self.enabled = True
        except Exception as e:
            print(f"MongoDB connection failed: {e}")
            self.client = None
            self.db = None
            self.enabled = False

    async def close(self) -> None:
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
            self.client = None
            self.db = None
            self.enabled = False

    async def status(self) -> dict[str, object]:
        if self.client is None:
            return {
                "mongo_connected": False,
                "database": self.db_name,
                "reason": "client_not_initialized",
            }

        try:
            await self.client.admin.command("ping")
            return {
                "mongo_connected": True,
                "database": self.db_name,
            }
        except Exception:
            return {
                "mongo_connected": False,
                "database": self.db_name,
                "reason": "ping_failed",
            }


# Global connection instance
mongo_connection = MongoConnection()
