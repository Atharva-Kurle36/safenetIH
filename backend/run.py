#!/usr/bin/env python
"""Run the FastAPI server from the backend directory."""
import sys
import os

# Add backend to path
backend_path = r"c:\Users\91930\Desktop\IndustrialHackathon2026\SafeNet-\backend"
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
