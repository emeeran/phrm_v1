"""Authentication API endpoints."""

from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user
from app.core.config import settings
from app.models.models import User
from app.schemas.schemas import UserCreate, UserResponse, Token, UserLogin
from app.services.user_service import UserService

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
) -> Any:
    """Register new user."""
    user = UserService.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    try:
        user = UserService.create_user(db, user=user_in)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=Token)
def login_for_access_token(
    db: Session = Depends(get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """OAuth2 compatible token login, get an access token for future requests."""
    user = UserService.authenticate_user(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token = UserService.create_access_token_for_user(user)
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.post("/login/json", response_model=Token)
def login_json(
    *,
    db: Session = Depends(get_db),
    user_credentials: UserLogin,
) -> Any:
    """JSON login endpoint."""
    user = UserService.authenticate_user(
        db, email=user_credentials.email, password=user_credentials.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token = UserService.create_access_token_for_user(user)
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.post("/test-token", response_model=UserResponse)
def test_token(current_user: User = Depends(get_current_active_user)) -> Any:
    """Test access token."""
    return current_user


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_active_user)) -> Any:
    """Get current user."""
    return current_user
