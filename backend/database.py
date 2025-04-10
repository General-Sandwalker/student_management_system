"""
This file sets up the database connection and session management using SQLAlchemy.
It uses SQLite as the database engine.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite database URL (creates student.db in the project root)
DATABASE_URL = "sqlite:///./student.db"

# Create the SQLAlchemy engine
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our ORM models to inherit from
Base = declarative_base()

def get_db():
    """
    Dependency for getting a database session.
    It will be used in route functions with `Depends(get_db)`.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
