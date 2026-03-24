from __future__ import annotations

import os

from pymongo import MongoClient
from pymongo.database import Database
from pymongo.errors import PyMongoError


class MongoConnection:
    def __init__(self) -> None:
        self.uri = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
        self.db_name = os.getenv("MONGO_DB_NAME", "safenet")
        self.client: MongoClient | None = None
        self.db: Database | None = None
        self.enabled = False
        self._connect()

    def _connect(self) -> None:
        try:
            client = MongoClient(self.uri, serverSelectionTimeoutMS=2000)
            client.admin.command("ping")
            self.client = client
            self.db = client[self.db_name]
            self.enabled = True
        except PyMongoError:
            self.client = None
            self.db = None
            self.enabled = False

    def status(self) -> dict[str, object]:
        if self.client is None:
            return {
                "mongo_connected": False,
                "database": self.db_name,
                "reason": "client_not_initialized",
            }

        try:
            self.client.admin.command("ping")
            return {
                "mongo_connected": True,
                "database": self.db_name,
            }
        except PyMongoError:
            return {
                "mongo_connected": False,
                "database": self.db_name,
                "reason": "ping_failed",
            }


mongo_connection = MongoConnection()
