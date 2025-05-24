"""Health record management service."""

from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import datetime

from app.models.models import HealthRecord, FamilyMember, Medication, Appointment
from app.schemas.schemas import (
    HealthRecordCreate, HealthRecordUpdate,
    MedicationCreate, MedicationUpdate,
    AppointmentCreate, AppointmentUpdate
)


class HealthRecordService:
    """Service for health record management operations."""

    @staticmethod
    def get_health_record(db: Session, record_id: int) -> Optional[HealthRecord]:
        """Get health record by ID."""
        return db.query(HealthRecord).filter(HealthRecord.id == record_id).first()

    @staticmethod
    def get_health_records_by_member(db: Session, member_id: int) -> List[HealthRecord]:
        """Get all health records for a family member."""
        return db.query(HealthRecord).filter(HealthRecord.family_member_id == member_id).all()

    @staticmethod
    def create_health_record(
        db: Session, 
        record: HealthRecordCreate, 
        member_id: int,
        user_id: int
    ) -> HealthRecord:
        """Create a new health record."""
        # Verify the family member belongs to the user
        member = db.query(FamilyMember).filter(
            FamilyMember.id == member_id,
            FamilyMember.user_id == user_id
        ).first()
        
        if not member:
            raise ValueError("Family member not found or access denied")

        try:
            db_record = HealthRecord(
                family_member_id=member_id,
                record_type=record.record_type,
                title=record.title,
                description=record.description,
                date_recorded=record.date_recorded or datetime.utcnow(),
                doctor_name=record.doctor_name,
                hospital_clinic=record.hospital_clinic,
                severity=record.severity,
                status=record.status,
                notes=record.notes
            )
            db.add(db_record)
            db.commit()
            db.refresh(db_record)
            return db_record
        except IntegrityError:
            db.rollback()
            raise ValueError("Error creating health record")

    @staticmethod
    def update_health_record(
        db: Session, 
        record_id: int, 
        record_update: HealthRecordUpdate,
        user_id: int
    ) -> Optional[HealthRecord]:
        """Update health record information."""
        # Verify the record belongs to a family member of the user
        db_record = db.query(HealthRecord).join(FamilyMember).filter(
            HealthRecord.id == record_id,
            FamilyMember.user_id == user_id
        ).first()
        
        if not db_record:
            return None
        
        update_data = record_update.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(db_record, field, value)
        
        db.commit()
        db.refresh(db_record)
        return db_record

    @staticmethod
    def delete_health_record(db: Session, record_id: int, user_id: int) -> bool:
        """Delete health record by ID."""
        db_record = db.query(HealthRecord).join(FamilyMember).filter(
            HealthRecord.id == record_id,
            FamilyMember.user_id == user_id
        ).first()
        
        if not db_record:
            return False
        
        db.delete(db_record)
        db.commit()
        return True

    @staticmethod
    def search_health_records(
        db: Session,
        user_id: int,
        search_term: str,
        record_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[HealthRecord]:
        """Search health records by various criteria."""
        query = db.query(HealthRecord).join(FamilyMember).filter(
            FamilyMember.user_id == user_id
        )
        
        if search_term:
            query = query.filter(
                (HealthRecord.title.ilike(f"%{search_term}%") |
                 HealthRecord.description.ilike(f"%{search_term}%") |
                 HealthRecord.doctor_name.ilike(f"%{search_term}%"))
            )
        
        if record_type:
            query = query.filter(HealthRecord.record_type == record_type)
        
        return query.offset(skip).limit(limit).all()


class MedicationService:
    """Service for medication management operations."""

    @staticmethod
    def get_medication(db: Session, medication_id: int) -> Optional[Medication]:
        """Get medication by ID."""
        return db.query(Medication).filter(Medication.id == medication_id).first()

    @staticmethod
    def get_medications_by_member(db: Session, member_id: int) -> List[Medication]:
        """Get all medications for a family member."""
        return db.query(Medication).filter(Medication.family_member_id == member_id).all()

    @staticmethod
    def create_medication(
        db: Session, 
        medication: MedicationCreate, 
        member_id: int,
        user_id: int
    ) -> Medication:
        """Create a new medication record."""
        # Verify the family member belongs to the user
        member = db.query(FamilyMember).filter(
            FamilyMember.id == member_id,
            FamilyMember.user_id == user_id
        ).first()
        
        if not member:
            raise ValueError("Family member not found or access denied")

        try:
            db_medication = Medication(
                family_member_id=member_id,
                name=medication.name,
                dosage=medication.dosage,
                frequency=medication.frequency,
                start_date=medication.start_date,
                end_date=medication.end_date,
                prescribed_by=medication.prescribed_by,
                purpose=medication.purpose,
                side_effects=medication.side_effects,
                is_active=medication.is_active,
                notes=medication.notes
            )
            db.add(db_medication)
            db.commit()
            db.refresh(db_medication)
            return db_medication
        except IntegrityError:
            db.rollback()
            raise ValueError("Error creating medication record")


class AppointmentService:
    """Service for appointment management operations."""

    @staticmethod
    def get_appointment(db: Session, appointment_id: int) -> Optional[Appointment]:
        """Get appointment by ID."""
        return db.query(Appointment).filter(Appointment.id == appointment_id).first()

    @staticmethod
    def get_appointments_by_member(db: Session, member_id: int) -> List[Appointment]:
        """Get all appointments for a family member."""
        return db.query(Appointment).filter(Appointment.family_member_id == member_id).all()

    @staticmethod
    def create_appointment(
        db: Session, 
        appointment: AppointmentCreate, 
        member_id: int,
        user_id: int
    ) -> Appointment:
        """Create a new appointment."""
        # Verify the family member belongs to the user
        member = db.query(FamilyMember).filter(
            FamilyMember.id == member_id,
            FamilyMember.user_id == user_id
        ).first()
        
        if not member:
            raise ValueError("Family member not found or access denied")

        try:
            db_appointment = Appointment(
                family_member_id=member_id,
                title=appointment.title,
                doctor_name=appointment.doctor_name,
                hospital_clinic=appointment.hospital_clinic,
                appointment_date=appointment.appointment_date,
                appointment_type=appointment.appointment_type,
                status=appointment.status,
                notes=appointment.notes
            )
            db.add(db_appointment)
            db.commit()
            db.refresh(db_appointment)
            return db_appointment
        except IntegrityError:
            db.rollback()
            raise ValueError("Error creating appointment")
