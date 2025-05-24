"""
Core configuration settings for PHRM application.
"""
import secrets
from typing import List, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # Project info
    PROJECT_NAME: str = "Personal Health Records Manager"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    ALGORITHM: str = "HS256"
    
    # Database
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./phrm.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:5173"
    ]
    
    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    # Email (optional)
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    
    # AI/ML (optional)
    OPENAI_API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
