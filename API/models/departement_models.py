from typing import List
from pydantic import BaseModel


class DepartmentInCreate(BaseModel):
    name : str
    description : str

class DepartmentInUpdate(BaseModel):
    id: int
    name : str
    description : str

class Student(BaseModel):
    id: str
    name: str
    email: str
    isBlocked: bool

class DepartmentInGet(BaseModel):
    id: int
    name: str
    description: str
    students: List[Student]
