"""API v1 router."""

from fastapi import APIRouter

from app.api.api_v1.endpoints import auth, users, family_members, health_records

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(family_members.router, prefix="/family-members", tags=["family-members"])
api_router.include_router(health_records.router, prefix="/health-records", tags=["health-records"])
