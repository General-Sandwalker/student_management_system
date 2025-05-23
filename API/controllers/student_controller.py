from fastapi import HTTPException
from DAO import student_dao

def block_student_tt(student_id: int):
    success = student_dao.change_status_student_by_id(student_id, True)
    if not success:
        print(f"Failed to block student with ID: {student_id}")
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student blocked successfully"}

def unblock_student(student_id: int):
    success = student_dao.change_status_student_by_id(student_id, False)
    if not success:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student unblocked successfully"}

def delete_student(student_id: int):
    success = student_dao.delete_student_by_id(student_id)
    if not success:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student deleted successfully"}


def update_student_email_name(student_id: int, email: str, name: str):
    success = student_dao.update_email_name_by_id(student_id, email, name)
    if not success:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student email and name updated successfully"}


def update_student_bio(student_id: int, about: str):
    success = student_dao.update_bio_by_id(student_id, about)
    if not success:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student bio updated successfully"}

def get_student_by_id_t(student_id: int):
    student = student_dao.get_student_by_id(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student