"""
This file defines Pydantic schemas for request and response validation.
"""

from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


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
    title: str = Field(..., min_length=1, max_length=100, example="Docker Fundamentals")
    description: Optional[str] = Field(
        None, 
        max_length=500, 
        example="Learn containerization with Docker"
    )

    @field_validator('title')
    def validate_title(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("Title cannot be empty")
        return v

class FormationCreate(FormationBase):
    pass

class FormationUpdate(BaseModel):
    title: Optional[str] = Field(
        None,
        min_length=1,
        max_length=100,
        example="Advanced Docker"
    )
    description: Optional[str] = Field(
        None,
        max_length=500,
        example="Deep dive into Docker concepts"
    )

    @field_validator('title')
    def validate_title(cls, v):
        if v is not None:  # Only validate if title is provided
            v = v.strip()
            if not v:
                raise ValueError("Title cannot be empty")
        return v

class FormationRead(FormationBase):
    id: int
    students_count: Optional[int] = Field(
        None,
        description="Number of students enrolled",
        example=25
    )

    class Config:
        from_attributes = True  # Replaces orm_mode in Pydantic v2
        json_schema_extra = {
            "example": {
                "id": 1,
                "title": "Docker Fundamentals",
                "description": "Learn containerization with Docker",
                "students_count": 25
            }
        }



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
