"""Family member management API endpoints."""

from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user
from app.models.models import User
from app.schemas.schemas import (
    FamilyMemberCreate, 
    FamilyMemberUpdate, 
    FamilyMemberResponse,
    FamilyMemberDetailResponse
)
from app.services.family_member_service import FamilyMemberService

router = APIRouter()


@router.get("/", response_model=List[FamilyMemberResponse])
def read_family_members(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    search: Optional[str] = Query(None, description="Search by name or relationship"),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Retrieve family members for current user."""
    if search:
        family_members = FamilyMemberService.search_family_members(
            db, user_id=current_user.id, search_term=search, skip=skip, limit=limit
        )
    else:
        family_members = FamilyMemberService.get_family_members_by_user(
            db, user_id=current_user.id
        )
        # Apply pagination
        family_members = family_members[skip:skip+limit]
    
    return family_members


@router.post("/", response_model=FamilyMemberResponse, status_code=status.HTTP_201_CREATED)
def create_family_member(
    *,
    db: Session = Depends(get_db),
    family_member_in: FamilyMemberCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Create new family member."""
    try:
        family_member = FamilyMemberService.create_family_member(
            db, member=family_member_in, user_id=current_user.id
        )
        return family_member
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{member_id}", response_model=FamilyMemberDetailResponse)
def read_family_member(
    *,
    db: Session = Depends(get_db),
    member_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Get family member by ID with health records."""
    family_member = FamilyMemberService.get_family_member_with_records(
        db, member_id=member_id, user_id=current_user.id
    )
    if not family_member:
        raise HTTPException(status_code=404, detail="Family member not found")
    
    return family_member


@router.put("/{member_id}", response_model=FamilyMemberResponse)
def update_family_member(
    *,
    db: Session = Depends(get_db),
    member_id: int,
    family_member_in: FamilyMemberUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Update family member."""
    family_member = FamilyMemberService.update_family_member(
        db, member_id=member_id, member_update=family_member_in, user_id=current_user.id
    )
    if not family_member:
        raise HTTPException(status_code=404, detail="Family member not found")
    
    return family_member


@router.delete("/{member_id}")
def delete_family_member(
    *,
    db: Session = Depends(get_db),
    member_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Delete family member."""
    success = FamilyMemberService.delete_family_member(
        db, member_id=member_id, user_id=current_user.id
    )
    if not success:
        raise HTTPException(status_code=404, detail="Family member not found")
    
    return {"message": "Family member deleted successfully"}
