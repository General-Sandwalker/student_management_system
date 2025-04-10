"""
This file defines the SQLAlchemy models for the database.
"""

from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.ext.hybrid import hybrid_property

# Association table: Many-to-Many relationship between students and formations
student_formation_table = Table(
    "student_formation",
    Base.metadata,
    Column("student_id", Integer, ForeignKey("students.id")),
    Column("formation_id", Integer, ForeignKey("formations.id"))
)

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    # Relationship: one department has many students
    students = relationship("Student", back_populates="department")

    @hybrid_property
    def student_count(self):
        return len(self.students) if self.students else 0


class Formation(Base):
    __tablename__ = "formations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, nullable=False)
    description = Column(String)

    # Relationship: many students can enroll in a formation
    students = relationship(
        "Student",
        secondary=student_formation_table,
        back_populates="formations"
    )


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)  # 👈 New field

    department_id = Column(Integer, ForeignKey("departments.id"))

    department = relationship("Department", back_populates="students")
    formations = relationship(
        "Formation",
        secondary=student_formation_table,
        back_populates="students"
    )


# In models.py
class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)