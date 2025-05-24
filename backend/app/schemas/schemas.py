"""
Pydantic schemas for API request/response validation.
"""
from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


# User schemas
class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[date] = None


class UserCreate(UserBase):
    """User creation schema."""
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    """User update schema."""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    password: Optional[str] = Field(None, min_length=6)


class UserResponse(UserBase):
    """User response schema."""
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Authentication schemas
class Token(BaseModel):
    """Token response schema."""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Token data schema."""
    user_id: Optional[str] = None


class UserLogin(BaseModel):
    """User login schema."""
    email: EmailStr
    password: str


# Family Member schemas
class FamilyMemberBase(BaseModel):
    """Base family member schema."""
    full_name: str = Field(..., min_length=1, max_length=255)
    relationship: str = Field(..., min_length=1, max_length=100)
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = Field(None, max_length=20)
    emergency_contact: bool = False
    notes: Optional[str] = None


class FamilyMemberCreate(FamilyMemberBase):
    """Family member creation schema."""
    pass


class FamilyMemberUpdate(BaseModel):
    """Family member update schema."""
    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    relationship: Optional[str] = Field(None, min_length=1, max_length=100)
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = Field(None, max_length=20)
    emergency_contact: Optional[bool] = None
    notes: Optional[str] = None


class FamilyMemberResponse(FamilyMemberBase):
    """Family member response schema."""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Family Member with health records
class FamilyMemberDetailResponse(FamilyMemberResponse):
    """Family member with health records."""
    health_records: List["HealthRecordResponse"] = []
    medications: List["MedicationResponse"] = []
    appointments: List["AppointmentResponse"] = []


# Health Record schemas
class HealthRecordBase(BaseModel):
    """Base health record schema."""
    record_type: str = Field(..., min_length=1, max_length=50)
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    date_recorded: Optional[datetime] = None
    doctor_name: Optional[str] = Field(None, max_length=255)
    hospital_clinic: Optional[str] = Field(None, max_length=255)
    severity: Optional[str] = Field(None, max_length=20)
    status: Optional[str] = Field(None, max_length=20)
    notes: Optional[str] = None


class HealthRecordCreate(HealthRecordBase):
    """Health record creation schema."""
    pass


class HealthRecordUpdate(BaseModel):
    """Health record update schema."""
    record_type: Optional[str] = Field(None, min_length=1, max_length=50)
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    date_recorded: Optional[datetime] = None
    doctor_name: Optional[str] = Field(None, max_length=255)
    hospital_clinic: Optional[str] = Field(None, max_length=255)
    severity: Optional[str] = Field(None, max_length=20)
    status: Optional[str] = Field(None, max_length=20)
    notes: Optional[str] = None


class HealthRecordResponse(HealthRecordBase):
    """Health record response schema."""
    id: int
    family_member_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Medication schemas
class MedicationBase(BaseModel):
    """Base medication schema."""
    name: str = Field(..., min_length=1, max_length=255)
    dosage: str = Field(..., min_length=1, max_length=100)
    frequency: str = Field(..., min_length=1, max_length=100)
    start_date: date
    end_date: Optional[date] = None
    prescribed_by: Optional[str] = Field(None, max_length=255)
    purpose: Optional[str] = None
    side_effects: Optional[str] = None
    is_active: bool = True
    notes: Optional[str] = None


class MedicationCreate(MedicationBase):
    """Medication creation schema."""
    pass


class MedicationUpdate(BaseModel):
    """Medication update schema."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    dosage: Optional[str] = Field(None, min_length=1, max_length=100)
    frequency: Optional[str] = Field(None, min_length=1, max_length=100)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    prescribed_by: Optional[str] = Field(None, max_length=255)
    purpose: Optional[str] = None
    side_effects: Optional[str] = None
    is_active: Optional[bool] = None
    notes: Optional[str] = None


class MedicationResponse(MedicationBase):
    """Medication response schema."""
    id: int
    family_member_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Appointment schemas
class AppointmentBase(BaseModel):
    """Base appointment schema."""
    title: str = Field(..., min_length=1, max_length=255)
    doctor_name: Optional[str] = Field(None, max_length=255)
    hospital_clinic: Optional[str] = Field(None, max_length=255)
    appointment_date: datetime
    appointment_type: Optional[str] = Field(None, max_length=100)
    status: str = Field(default="scheduled", max_length=20)
    notes: Optional[str] = None


class AppointmentCreate(AppointmentBase):
    """Appointment creation schema."""
    pass


class AppointmentUpdate(BaseModel):
    """Appointment update schema."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    doctor_name: Optional[str] = Field(None, max_length=255)
    hospital_clinic: Optional[str] = Field(None, max_length=255)
    appointment_date: Optional[datetime] = None
    appointment_type: Optional[str] = Field(None, max_length=100)
    status: Optional[str] = Field(None, max_length=20)
    notes: Optional[str] = None


class AppointmentResponse(AppointmentBase):
    """Appointment response schema."""
    id: int
    family_member_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Response schemas
class StandardResponse(BaseModel):
    """Standard API response."""
    success: bool
    message: str
    data: Optional[dict] = None


class PaginatedResponse(BaseModel):
    """Paginated response schema."""
    items: List[dict]
    total: int
    page: int
    size: int
    pages: int


# Update forward references
FamilyMemberDetailResponse.model_rebuild()
