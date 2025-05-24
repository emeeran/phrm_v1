"""User management service."""

from datetime import timedelta
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.models import User
from app.schemas.schemas import UserCreate, UserUpdate
from app.core.config import settings


class UserService:
    """Service for user management operations."""

    @staticmethod
    def get_user(db: Session, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email."""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def create_user(db: Session, user: UserCreate) -> User:
        """Create a new user."""
        try:
            hashed_password = get_password_hash(user.password)
            db_user = User(
                email=user.email,
                full_name=user.full_name,
                hashed_password=hashed_password,
                date_of_birth=user.date_of_birth,
                phone_number=user.phone_number
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            return db_user
        except IntegrityError:
            db.rollback()
            raise ValueError("User with this email already exists")

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password."""
        user = UserService.get_user_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
        """Update user information."""
        db_user = UserService.get_user(db, user_id)
        if not db_user:
            return None
        
        update_data = user_update.dict(exclude_unset=True)
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
        
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def create_access_token_for_user(user: User) -> str:
        """Create access token for user."""
        return create_access_token(
            data={"sub": str(user.id)},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )

    @staticmethod
    def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
        """Get all users with pagination."""
        return db.query(User).offset(skip).limit(limit).all()

    @staticmethod
    def delete_user(db: Session, user_id: int) -> bool:
        """Delete user by ID."""
        db_user = UserService.get_user(db, user_id)
        if not db_user:
            return False
        
        db.delete(db_user)
        db.commit()
        return True
