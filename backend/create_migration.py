"""
Script to generate Alembic migrations without involving the entire application.
This avoids circular imports and other issues that can occur when running migrations.
"""
import os
from alembic.config import Config
from alembic import command

# Set up the Alembic configuration
alembic_cfg = Config(os.path.join(os.path.dirname(__file__), "alembic.ini"))
alembic_cfg.set_main_option("script_location", "alembic")

# Create the migration
command.revision(alembic_cfg, message="Create initial tables", autogenerate=True)

print("Migration created successfully!")
