from pydantic import BaseModel
from typing import Dict, Optional

class HealthResponse(BaseModel):
    status: str
    backend_active: bool
    components: Dict[str, str]
    timestamp: str
