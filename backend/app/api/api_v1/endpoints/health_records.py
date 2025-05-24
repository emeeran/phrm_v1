"""Health record management API endpoints."""

from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user
from app.models.models import User
from app.schemas.schemas import (
    HealthRecordCreate,
    HealthRecordUpdate, 
    HealthRecordResponse,
    MedicationCreate,
    MedicationResponse,
    AppointmentCreate,
    AppointmentResponse
)
from app.services.health_record_service import (
    HealthRecordService,
    MedicationService,
    AppointmentService
)

router = APIRouter()


# Health Records endpoints
@router.get("/", response_model=List[HealthRecordResponse])
def read_health_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    search: Optional[str] = Query(None, description="Search records by title, description, or doctor"),
    record_type: Optional[str] = Query(None, description="Filter by record type"),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Retrieve health records for current user's family."""
    if search or record_type:
        health_records = HealthRecordService.search_health_records(
            db, 
            user_id=current_user.id,
            search_term=search or "",
            record_type=record_type,
            skip=skip,
            limit=limit
        )
    else:
        # Get all records for user's family members
        health_records = HealthRecordService.search_health_records(
            db,
            user_id=current_user.id,
            search_term="",
            skip=skip,
            limit=limit
        )
    
    return health_records


@router.post("/family-members/{member_id}/records", response_model=HealthRecordResponse, status_code=status.HTTP_201_CREATED)
def create_health_record(
    *,
    db: Session = Depends(get_db),
    member_id: int,
    health_record_in: HealthRecordCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Create new health record for family member."""
    try:
        health_record = HealthRecordService.create_health_record(
            db, record=health_record_in, member_id=member_id, user_id=current_user.id
        )
        return health_record
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/family-members/{member_id}/records", response_model=List[HealthRecordResponse])
def read_health_records_by_member(
    *,
    db: Session = Depends(get_db),
    member_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Get all health records for a family member."""
    # Verify the family member belongs to the user
    from app.services.family_member_service import FamilyMemberService
    family_member = FamilyMemberService.get_family_member(db, member_id)
    if not family_member or family_member.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Family member not found")
    
    health_records = HealthRecordService.get_health_records_by_member(db, member_id=member_id)
    return health_records


@router.get("/{record_id}", response_model=HealthRecordResponse)
def read_health_record(
    *,
    db: Session = Depends(get_db),
    record_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Get health record by ID."""
    health_record = HealthRecordService.get_health_record(db, record_id=record_id)
    if not health_record:
        raise HTTPException(status_code=404, detail="Health record not found")
    
    # Verify the record belongs to user's family member
    if health_record.family_member.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return health_record


@router.put("/{record_id}", response_model=HealthRecordResponse)
def update_health_record(
    *,
    db: Session = Depends(get_db),
    record_id: int,
    health_record_in: HealthRecordUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Update health record."""
    health_record = HealthRecordService.update_health_record(
        db, record_id=record_id, record_update=health_record_in, user_id=current_user.id
    )
    if not health_record:
        raise HTTPException(status_code=404, detail="Health record not found")
    
    return health_record


@router.delete("/{record_id}")
def delete_health_record(
    *,
    db: Session = Depends(get_db),
    record_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Delete health record."""
    success = HealthRecordService.delete_health_record(
        db, record_id=record_id, user_id=current_user.id
    )
    if not success:
        raise HTTPException(status_code=404, detail="Health record not found")
    
    return {"message": "Health record deleted successfully"}


# Medication endpoints
@router.post("/family-members/{member_id}/medications", response_model=MedicationResponse, status_code=status.HTTP_201_CREATED)
def create_medication(
    *,
    db: Session = Depends(get_db),
    member_id: int,
    medication_in: MedicationCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Create new medication record for family member."""
    try:
        medication = MedicationService.create_medication(
            db, medication=medication_in, member_id=member_id, user_id=current_user.id
        )
        return medication
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/family-members/{member_id}/medications", response_model=List[MedicationResponse])
def read_medications_by_member(
    *,
    db: Session = Depends(get_db),
    member_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Get all medications for a family member."""
    # Verify the family member belongs to the user
    from app.services.family_member_service import FamilyMemberService
    family_member = FamilyMemberService.get_family_member(db, member_id)
    if not family_member or family_member.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Family member not found")
    
    medications = MedicationService.get_medications_by_member(db, member_id=member_id)
    return medications


# Appointment endpoints
@router.post("/family-members/{member_id}/appointments", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
def create_appointment(
    *,
    db: Session = Depends(get_db),
    member_id: int,
    appointment_in: AppointmentCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Create new appointment for family member."""
    try:
        appointment = AppointmentService.create_appointment(
            db, appointment=appointment_in, member_id=member_id, user_id=current_user.id
        )
        return appointment
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/family-members/{member_id}/appointments", response_model=List[AppointmentResponse])
def read_appointments_by_member(
    *,
    db: Session = Depends(get_db),
    member_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Get all appointments for a family member."""
    # Verify the family member belongs to the user
    from app.services.family_member_service import FamilyMemberService
    family_member = FamilyMemberService.get_family_member(db, member_id)
    if not family_member or family_member.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Family member not found")
    
    appointments = AppointmentService.get_appointments_by_member(db, member_id=member_id)
    return appointments
