"""User management API endpoints."""

from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user
from app.models.models import User
from app.schemas.schemas import UserResponse, UserUpdate
from app.services.user_service import UserService

router = APIRouter()


@router.get("/", response_model=List[UserResponse])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Retrieve users."""
    users = UserService.get_all_users(db, skip=skip, limit=limit)
    return users


@router.get("/{user_id}", response_model=UserResponse)
def read_user(
    *,
    db: Session = Depends(get_db),
    user_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Get user by ID."""
    user = UserService.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Users can only access their own data (for now)
    if user.id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    *,
    db: Session = Depends(get_db),
    user_id: int,
    user_in: UserUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Update user."""
    user = UserService.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Users can only update their own data
    if user.id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    user = UserService.update_user(db, user_id=user_id, user_update=user_in)
    return user


@router.delete("/{user_id}")
def delete_user(
    *,
    db: Session = Depends(get_db),
    user_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Delete user."""
    user = UserService.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Users can only delete their own account
    if user.id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    success = UserService.delete_user(db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=400, detail="Could not delete user")
    
    return {"message": "User deleted successfully"}
