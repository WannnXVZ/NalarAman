from pydantic import BaseModel
from typing import List, Optional, Literal

class ClassificationResult(BaseModel):
    label: Literal["Normal", "Scam", "Promosi"]
    confidence: float

class SocialEngineeringIndicator(BaseModel):
    indicator: str
    description: str
    basis: str = "rule-based"

class RiskAssessment(BaseModel):
    level: Literal["rendah", "sedang", "tinggi"]
    basis: str

class LimeContribution(BaseModel):
    token: str
    weight: float
    direction: Literal["mendukung_scam", "menurunkan_skor_scam", "netral"]

class LimeExplanation(BaseModel):
    method: Literal["LIME"] = "LIME"
    available: bool
    contributions: Optional[List[LimeContribution]] = None
    reason: Optional[str] = None
    computation_time_ms: Optional[int] = None

class AnalyzeResponse(BaseModel):
    request_status: Literal["success", "error"] = "success"
    classification: ClassificationResult
    social_engineering_indicators: List[SocialEngineeringIndicator]
    risk_assessment: RiskAssessment
    explanation: LimeExplanation
    warnings: List[str]
