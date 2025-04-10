"""
This file contains API routes for students, departments, and formations.
"""

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, schemas
from database import get_db
from fastapi.security import OAuth2PasswordRequestForm
from auth import create_access_token, get_current_student, hash_password, verify_password, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_admin
from fastapi import status


router = APIRouter()


# --------------------------
# Department Routes
# --------------------------

@router.post("/departments/", response_model=schemas.DepartmentRead)
def create_department(dept: schemas.DepartmentCreate, db: Session = Depends(get_db)):
    db_dept = db.query(models.Department).filter(models.Department.name == dept.name).first()
    if db_dept:
        raise HTTPException(status_code=400, detail="Department already exists")
    new_dept = models.Department(name=dept.name)
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)
    return new_dept


@router.get("/departments/", response_model=list[schemas.DepartmentRead])
def list_departments(db: Session = Depends(get_db)):
    return db.query(models.Department).all()


# --------------------------
# Formation Routes
# --------------------------

@router.post("/formations/", response_model=schemas.FormationRead)
def create_formation(form: schemas.FormationCreate, db: Session = Depends(get_db)):
    new_form = models.Formation(**form.dict())
    db.add(new_form)
    db.commit()
    db.refresh(new_form)
    return new_form


@router.get("/formations/", response_model=list[schemas.FormationRead])
def list_formations(db: Session = Depends(get_db)):
    return db.query(models.Formation).all()


# --------------------------
# Student Routes
# --------------------------

@router.post("/students/", response_model=schemas.StudentRead)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    db_student = db.query(models.Student).filter(models.Student.email == student.email).first()
    if db_student:
        raise HTTPException(status_code=400, detail="Student with this email already exists")

    new_student = models.Student(
        name=student.name,
        email=student.email,
        password_hash=hash_password(student.password),  # 👈 hash the password
        department_id=student.department_id
    )

    if student.formation_ids:
        formations = db.query(models.Formation).filter(models.Formation.id.in_(student.formation_ids)).all()
        new_student.formations = formations

    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student


@router.get("/students/", response_model=list[schemas.StudentRead])
def list_students(
    db: Session = Depends(get_db),
    current_student: models.Student = Depends(get_current_student)
):
    return db.query(models.Student).all()

# --------------------------
# Profile Routes
# --------------------------

@router.get("/students/me", response_model=schemas.StudentRead)
def read_my_profile(current_student: models.Student = Depends(get_current_student)):
    print(f"Authenticated student ID: {current_student.id}")
    return current_student


@router.get("/students/{student_id}", response_model=schemas.StudentRead)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

# --------------------------
# Auth Routes
# --------------------------

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    student = db.query(models.Student).filter(models.Student.email == form_data.username).first()
    if not student or not verify_password(form_data.password, student.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token(data={"sub": str(student.id)})
    return {"access_token": token, "token_type": "bearer"}

# --------------------------
# Update Routes
# --------------------------

@router.put("/students/{student_id}", response_model=schemas.StudentRead)
def update_student(student_id: int, student_data: schemas.StudentCreate, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    student.name = student_data.name
    student.email = student_data.email
    student.department_id = student_data.department_id

    if student_data.formation_ids:
        formations = db.query(models.Formation).filter(models.Formation.id.in_(student_data.formation_ids)).all()
        student.formations = formations

    db.commit()
    db.refresh(student)
    return student

# --------------------------
# Admin Creation Routes
# --------------------------

# In routes.py
@router.post("/admins/", response_model=schemas.AdminRead)
def create_admin(admin: schemas.AdminCreate, db: Session = Depends(get_db)):
    db_admin = db.query(models.Admin).filter(models.Admin.email == admin.email).first()
    if db_admin:
        raise HTTPException(
            status_code=400,
            detail="Admin with this email already exists"
        )

    new_admin = models.Admin(
        name=admin.name,
        email=admin.email,
        password_hash=hash_password(admin.password)  # Same hashing as students
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin

@router.post("/admins/login")
def admin_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    admin = db.query(models.Admin).filter(models.Admin.email == form_data.username).first()
    if not admin or not verify_password(form_data.password, admin.password_hash):
        raise HTTPException(
            status_code=400,
            detail="Invalid email or password"
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": str(admin.id), "role": "admin"},
        expires_delta=access_token_expires
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "admin_id": admin.id  # Optional but helpful
    }

@router.get("/admin/stats")
async def get_admin_stats(
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    try:
        student_count = db.query(models.Student).count()
        dept_count = db.query(models.Department).count()
        formation_count = db.query(models.Formation).count()
        admin_count = db.query(models.Admin).count()
        
        return {
            "students": student_count,
            "departments": dept_count,
            "formations": formation_count,
            "admins": admin_count
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    
# --------------------------
# Delete Routes (with Admin Auth)
# --------------------------

@router.delete("/students/{student_id}", response_model=schemas.StudentRead)
def remove_student(
    student_id: int, 
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)  # Add admin auth
):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db.delete(student)
    db.commit()
    return student

@router.delete("/departments/{department_id}", response_model=schemas.DepartmentRead)
def remove_department(
    department_id: int, 
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)  # Add admin auth
):
    department = db.query(models.Department).filter(models.Department.id == department_id).first()
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    
    # Check if department has students before deleting
    if department.students:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete department with assigned students"
        )
    
    db.delete(department)
    db.commit()
    return department

@router.delete("/formations/{formation_id}", response_model=schemas.FormationRead)
def remove_formation(
    formation_id: int, 
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)  # Add admin auth
):
    formation = db.query(models.Formation).filter(models.Formation.id == formation_id).first()
    if not formation:
        raise HTTPException(status_code=404, detail="Formation not found")

    # Check if formation has students before deleting
    if formation.students:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete formation with assigned students"
        )

    db.delete(formation)
    db.commit()
    return formation