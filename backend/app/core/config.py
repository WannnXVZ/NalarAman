from typing import Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "NalarAman API"
    VERSION: str = "0.1.0-alpha"
    API_V1_PREFIX: str = "/api/v1"
    
    # ML & Feature Flags
    MODEL_PATH: str = "./app/ml/artifacts/indobert_v1"
    BASELINE_MODEL_PATH: str = "./app/ml/artifacts/tfidf_lr_v1"
    ENABLE_LIME: bool = True
    MAX_TEXT_LENGTH: int = 2000
    
    # CORS
    CORS_ORIGINS: Union[list[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            v_str = v.strip()
            if v_str.startswith("[") and v_str.endswith("]"):
                import json
                try:
                    return json.loads(v_str)
                except Exception:
                    pass
            return [i.strip() for i in v_str.split(",") if i.strip()]
        return v

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
