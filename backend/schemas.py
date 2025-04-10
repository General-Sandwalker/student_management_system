"""
This file defines Pydantic schemas for request and response validation.
"""

from typing import List, Optional
from pydantic import BaseModel


# --------------------------
# Department Schemas
# --------------------------

class DepartmentBase(BaseModel):
    name: str

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentRead(BaseModel):
    id: int
    name: str
    student_count: int
    
    class Config:
        orm_mode = True

class DepartmentSimple(BaseModel):
    id: int
    name: str
    
    class Config:
        orm_mode = True

# --------------------------
# Formation Schemas
# --------------------------

class FormationBase(BaseModel):
    title: str
    description: Optional[str] = None

class FormationCreate(FormationBase):
    pass

class FormationRead(FormationBase):
    id: int

    class Config:
        orm_mode = True


# --------------------------
# Student Schemas
# --------------------------

class StudentBase(BaseModel):
    name: str
    email: str
    department_id: int

class StudentCreate(StudentBase):
    password: str
    formation_ids: Optional[List[int]] = []

class StudentRead(StudentBase):
    id: int
    department: Optional[DepartmentSimple]  # Use simple department without student_count
    formations: List[FormationRead] = []
    
    class Config:
        orm_mode = True


# --------------------------
# Admin Schemas
# --------------------------

# In schemas.py
class AdminBase(BaseModel):
    name: str
    email: str

class AdminCreate(AdminBase):
    password: str  # Same as StudentCreate

class AdminRead(AdminBase):
    id: int

    class Config:
        from_attributes = True  # Updated from orm_mode in Pydantic v2
