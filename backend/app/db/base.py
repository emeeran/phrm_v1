"""
Database base configuration.
"""
from sqlalchemy.ext.asyncio import create_async_engine
from ..models.models import Base
from ..core.config import settings


async def create_tables():
    """Create database tables."""
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await engine.dispose()
