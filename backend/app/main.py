from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.exceptions import (
    ModelUnavailableException,
    model_unavailable_handler,
    InvalidInputException,
    invalid_input_handler,
    OcrFailedException,
    ocr_failed_handler,
    AppException,
    app_exception_handler
)
from app.routers import health, analyze, analyze_image

# Setup logging
setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Platform Deteksi Penipuan Digital Berbasis Explainable AI (NalarAman)",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration (PRD Bab 16.6 & 25)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
app.add_exception_handler(ModelUnavailableException, model_unavailable_handler)
app.add_exception_handler(InvalidInputException, invalid_input_handler)
app.add_exception_handler(OcrFailedException, ocr_failed_handler)
app.add_exception_handler(AppException, app_exception_handler)

# Register Routers
app.include_router(health.router, prefix=settings.API_V1_PREFIX)
app.include_router(analyze.router, prefix=settings.API_V1_PREFIX)
app.include_router(analyze_image.router, prefix=settings.API_V1_PREFIX)

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "api_v1": settings.API_V1_PREFIX
    }

logger.info(f"{settings.PROJECT_NAME} initialized successfully.")
