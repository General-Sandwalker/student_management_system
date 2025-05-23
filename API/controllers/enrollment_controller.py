from fastapi import HTTPException
from DAO import enrollment_dao

def get_enrolled_courses(student_id: int):
    try:
        enrollments = enrollment_dao.get_user_enrollments(student_id)
        return enrollments
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


def enroll_user(course_id: int, student_id: int):
    try:
        enrollment_dao.enroll_user(course_id, student_id)
        return {"message": "User enrolled successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def unenroll_user(course_id: int, student_id: int):
    try:
        enrollment_dao.unenroll_user(course_id, student_id)
        return {"message": "User unenrolled successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

def update_enrollment_progress(course_id: int, student_id: int, last_lesson_id: int):
    try:
        enrollment_dao.update_enrollment_progress(course_id, student_id, last_lesson_id)
        return {"message": "Enrollment progress updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))