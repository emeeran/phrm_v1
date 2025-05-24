"""Family member management service."""

from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.models import FamilyMember, User
from app.schemas.schemas import FamilyMemberCreate, FamilyMemberUpdate


class FamilyMemberService:
    """Service for family member management operations."""

    @staticmethod
    def get_family_member(db: Session, member_id: int) -> Optional[FamilyMember]:
        """Get family member by ID."""
        return db.query(FamilyMember).filter(FamilyMember.id == member_id).first()

    @staticmethod
    def get_family_members_by_user(db: Session, user_id: int) -> List[FamilyMember]:
        """Get all family members for a user."""
        return db.query(FamilyMember).filter(FamilyMember.user_id == user_id).all()

    @staticmethod
    def create_family_member(db: Session, member: FamilyMemberCreate, user_id: int) -> FamilyMember:
        """Create a new family member."""
        try:
            db_member = FamilyMember(
                user_id=user_id,
                full_name=member.full_name,
                relationship=member.relationship,
                date_of_birth=member.date_of_birth,
                phone_number=member.phone_number,
                emergency_contact=member.emergency_contact,
                notes=member.notes
            )
            db.add(db_member)
            db.commit()
            db.refresh(db_member)
            return db_member
        except IntegrityError:
            db.rollback()
            raise ValueError("Error creating family member")

    @staticmethod
    def update_family_member(
        db: Session, 
        member_id: int, 
        member_update: FamilyMemberUpdate,
        user_id: int
    ) -> Optional[FamilyMember]:
        """Update family member information."""
        db_member = db.query(FamilyMember).filter(
            FamilyMember.id == member_id,
            FamilyMember.user_id == user_id
        ).first()
        
        if not db_member:
            return None
        
        update_data = member_update.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(db_member, field, value)
        
        db.commit()
        db.refresh(db_member)
        return db_member

    @staticmethod
    def delete_family_member(db: Session, member_id: int, user_id: int) -> bool:
        """Delete family member by ID."""
        db_member = db.query(FamilyMember).filter(
            FamilyMember.id == member_id,
            FamilyMember.user_id == user_id
        ).first()
        
        if not db_member:
            return False
        
        db.delete(db_member)
        db.commit()
        return True

    @staticmethod
    def get_family_member_with_records(db: Session, member_id: int, user_id: int) -> Optional[FamilyMember]:
        """Get family member with all health records."""
        return db.query(FamilyMember).filter(
            FamilyMember.id == member_id,
            FamilyMember.user_id == user_id
        ).first()

    @staticmethod
    def search_family_members(
        db: Session, 
        user_id: int, 
        search_term: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[FamilyMember]:
        """Search family members by name or relationship."""
        return db.query(FamilyMember).filter(
            FamilyMember.user_id == user_id,
            (FamilyMember.full_name.ilike(f"%{search_term}%") |
             FamilyMember.relationship.ilike(f"%{search_term}%"))
        ).offset(skip).limit(limit).all()
