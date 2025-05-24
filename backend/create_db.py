"""
Script to create database tables directly without using Alembic.
"""
from datetime import datetime
from sqlalchemy import create_engine, ForeignKey, Integer, String, DateTime, Text, Boolean, Column
from sqlalchemy.orm import declarative_base, relationship

# Create declarative base
Base = declarative_base()


class User(Base):
    """User model."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    phone_number = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    family_members = relationship("FamilyMember", back_populates="user_ref")


class FamilyMember(Base):
    """Family member model."""
    __tablename__ = "family_members"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    full_name = Column(String(255), nullable=False)
    relation_type = Column(String(50), nullable=False)  # spouse, child, parent, etc.
    date_of_birth = Column(DateTime, nullable=True)
    phone_number = Column(String(20), nullable=True)
    emergency_contact = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user_ref = relationship("User", back_populates="family_members")
    health_records = relationship("HealthRecord", back_populates="family_member")
    medications = relationship("Medication", back_populates="family_member")
    appointments = relationship("Appointment", back_populates="family_member")


class HealthRecord(Base):
    """Health record model."""
    __tablename__ = "health_records"
    
    id = Column(Integer, primary_key=True, index=True)
    family_member_id = Column(Integer, ForeignKey("family_members.id"), nullable=False)
    record_type = Column(String(50), nullable=False)  # condition, allergy, procedure, etc.
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    date_recorded = Column(DateTime, nullable=False)
    doctor_name = Column(String(255), nullable=True)
    hospital_clinic = Column(String(255), nullable=True)
    severity = Column(String(20), nullable=True)
    status = Column(String(20), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    family_member = relationship("FamilyMember", back_populates="health_records")


class Medication(Base):
    """Medication model."""
    __tablename__ = "medications"
    
    id = Column(Integer, primary_key=True, index=True)
    family_member_id = Column(Integer, ForeignKey("family_members.id"), nullable=False)
    name = Column(String(255), nullable=False)
    dosage = Column(String(100), nullable=False)
    frequency = Column(String(100), nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    prescribed_by = Column(String(255), nullable=True)
    purpose = Column(Text, nullable=True)
    side_effects = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    family_member = relationship("FamilyMember", back_populates="medications")


class Appointment(Base):
    """Appointment model."""
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    family_member_id = Column(Integer, ForeignKey("family_members.id"), nullable=False)
    title = Column(String(255), nullable=False)
    doctor_name = Column(String(255), nullable=True)
    hospital_clinic = Column(String(255), nullable=True)
    appointment_date = Column(DateTime, nullable=False)
    appointment_type = Column(String(100), nullable=True)
    status = Column(String(20), default="scheduled")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    family_member = relationship("FamilyMember", back_populates="appointments")


if __name__ == "__main__":
    # Create database engine
    db_path = "sqlite:///phrm.db"
    engine = create_engine(db_path, connect_args={"check_same_thread": False})
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print(f"Database tables created successfully at {db_path}!")
