"""
Create database tables using the standalone models.
"""
from models_standalone import Base
from sqlalchemy import create_engine

# Database URL
DATABASE_URL = "sqlite:///./phrm.db"

# Create engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create all tables
def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
