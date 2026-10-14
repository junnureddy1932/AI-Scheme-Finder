from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed_data import seed_database
from app.routers import auth, profile, schemes, saved_schemes, tracker, assistant, admin

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("jansahayak")

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database schemas and seed verified government scheme catalog."""
    logger.info("Initializing database schemas...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        logger.info("Seeding verified government scheme catalog...")
        seed_database(db)
        logger.info("Seed data ready.")
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Centralized AI-powered Government Benefits Discovery & Application Assistant for India.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local dev and preview deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(profile.router, prefix=settings.API_V1_STR)
app.include_router(schemes.router, prefix=settings.API_V1_STR)
app.include_router(saved_schemes.router, prefix=settings.API_V1_STR)
app.include_router(tracker.router, prefix=settings.API_V1_STR)
app.include_router(assistant.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "database": "connected",
        "version": "1.0.0"
    }

@app.get("/")
def root():
    return {
        "message": "Welcome to JanSahayak AI Backend API.",
        "documentation": "/docs",
        "status": "operational"
    }
