from fastapi import APIRouter
from datetime import datetime, timezone
from app.schemas.health_response import HealthResponse
from app.ml.model_loader import model_manager

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("", response_model=HealthResponse)
async def check_health():
    """
    Health check endpoint (PRD Bab 17.1).
    Memeriksa keaktifan backend dan status kesiapan model AI.
    """
    return HealthResponse(
        status="ok",
        backend_active=True,
        components=model_manager.get_components_status(),
        timestamp=datetime.now(timezone.utc).isoformat()
    )
