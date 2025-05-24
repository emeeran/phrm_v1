"""
Database models for PHRM application.
"""
from datetime import datetime
from typing import List, Optional
from sqlalchemy import Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, Mapped, mapped_column, DeclarativeBase

class Base(DeclarativeBase):
    pass


class User(Base):
    """User model."""
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    date_of_birth: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    phone_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    family_members: Mapped[List["FamilyMember"]] = relationship("FamilyMember", back_populates="user_ref", lazy="joined")


class FamilyMember(Base):
    """Family member model."""
    __tablename__ = "family_members"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    relation_type: Mapped[str] = mapped_column(String(50), nullable=False)  # spouse, child, parent, etc.
    date_of_birth: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    phone_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    emergency_contact: Mapped[bool] = mapped_column(Boolean, default=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user_ref: Mapped["User"] = relationship("User", back_populates="family_members", lazy="joined")
    health_records: Mapped[List["HealthRecord"]] = relationship("HealthRecord", back_populates="family_member", lazy="selectin")
    medications: Mapped[List["Medication"]] = relationship("Medication", back_populates="family_member", lazy="selectin")
    appointments: Mapped[List["Appointment"]] = relationship("Appointment", back_populates="family_member", lazy="selectin")


class HealthRecord(Base):
    """Health record model."""
    __tablename__ = "health_records"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    family_member_id: Mapped[int] = mapped_column(Integer, ForeignKey("family_members.id"), nullable=False)
    record_type: Mapped[str] = mapped_column(String(50), nullable=False)  # condition, allergy, procedure, etc.
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    date_recorded: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    doctor_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    hospital_clinic: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    severity: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    status: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    family_member: Mapped["FamilyMember"] = relationship("FamilyMember", back_populates="health_records", lazy="joined")


class Medication(Base):
    """Medication model."""
    __tablename__ = "medications"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    family_member_id: Mapped[int] = mapped_column(Integer, ForeignKey("family_members.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    dosage: Mapped[str] = mapped_column(String(100), nullable=False)
    frequency: Mapped[str] = mapped_column(String(100), nullable=False)
    start_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    prescribed_by: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    purpose: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    side_effects: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    family_member: Mapped["FamilyMember"] = relationship("FamilyMember", back_populates="medications", lazy="joined")


class Appointment(Base):
    """Appointment model."""
    __tablename__ = "appointments"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    family_member_id: Mapped[int] = mapped_column(Integer, ForeignKey("family_members.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    doctor_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    hospital_clinic: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    appointment_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    appointment_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="scheduled")
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    family_member: Mapped["FamilyMember"] = relationship("FamilyMember", back_populates="appointments", lazy="joined")
