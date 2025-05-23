from fastapi import HTTPException
from lib.security import verify_password, hash_password
from lib.auth import create_access_token, decode_access_token
from models.user_models import UserInLogin, UserInRegister
from datetime import timedelta
from DAO import student_dao

def login(user: UserInLogin):
    student = student_dao.get_student_by_email(user.email)
    if not student:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if not verify_password(user.password, student['password']):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if student['isBlocked']:
        raise HTTPException(status_code=403, detail="Your account is blocked.")
    
    access_token_expires = timedelta(minutes=5000)
    access_token = create_access_token(
        data={"sub": str(student['id'])},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": student['id']
    }

def register(user: UserInRegister):
    student = student_dao.get_student_by_email(user.email)
    if student:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    student_id = student_dao.insert_student(
        email=user.email,
        password=hashed_password,
        department_id=user.departmentId,
        username=user.username,
    )
    access_token_expires = timedelta(minutes=5000)
    access_token = create_access_token(
        data={"sub": str(student_id)},
        expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": student_id
    }

def checkAuth(token: str):
    try:
        payload = decode_access_token(token)
        user_id = int(payload.get("sub"))
        student = student_dao.get_student_by_id(user_id)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        if student['isBlocked']:
            raise HTTPException(status_code=403, detail="Account is blocked")
        return student
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
