"""Initialize database tables."""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.models.models import Base

# Create engine
engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, connect_args={"check_same_thread": False})

# Create all tables
def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
