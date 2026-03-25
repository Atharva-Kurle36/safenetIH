from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.analyze import router as analyze_router
from app.routes.dashboard import router as dashboard_router
from app.routes.simulate import router as simulate_router
from app.services.mongo_client import mongo_connection


app = FastAPI(
    title="SafeNet API",
    description="Backend API for phishing analysis and simulation.",
    version="1.0.0",
)


allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://safenetih.vercel.app",
    "https://safenetih.vercel.app/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|safenetih\.vercel\.app)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router)
app.include_router(simulate_router)
app.include_router(dashboard_router)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "SafeNet backend is running."}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health/db")
def health_db() -> dict[str, object]:
    return mongo_connection.status()
