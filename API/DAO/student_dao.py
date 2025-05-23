from lib.db import get_cursor

def get_student_by_email(email: str):
    with get_cursor() as cursor:
        cursor.execute("SELECT id, password, is_blocked FROM student WHERE email = %s", (email,))
        student = cursor.fetchone()
        if student:
            return {
                "id": student[0],
                "password": student[1],
                "isBlocked": student[2]
            }
        return None

def get_student_by_id(student_id: int):
    with get_cursor() as cursor:
        cursor.execute("SELECT username, email, create_at, about FROM student WHERE id = %s", (student_id,))
        student = cursor.fetchone()
        if student:
            return {
                "name": student[0],
                "email": student[1],
                "joinedDate": student[2].isoformat() if student[2] else None,
                "bio": student[3]
            }
        return None


def get_students_by_department(department_id: int):
    with get_cursor() as cursor:
        cursor.execute("SELECT id, username , email, is_blocked FROM student WHERE department_id = %s", (department_id,))
        result = []
        students = cursor.fetchall()
        for student in students:
            student_dict = {
                "id": student[0],
                "name": student[1],
                "email": student[2],
                "isBlocked": student[3]
            }
            result.append(student_dict)
        return result

def insert_student(email: str, password: str, department_id: int, username: str):
    with get_cursor() as cursor:
        cursor.execute(
            "INSERT INTO student (email, password, department_id, username) VALUES (%s, %s, %s, %s) RETURNING id",
            (email, password, department_id, username)
        )
        return cursor.fetchone()[0]

def update_email_name_by_id(student_id: int, email: str, username: str):
    with get_cursor() as cursor:
        cursor.execute(
            "UPDATE student SET email = %s, username = %s WHERE id = %s",
            (email, username, student_id)
        )
        return cursor.rowcount > 0

def update_bio_by_id(student_id: int, about: str):
    with get_cursor() as cursor:
        cursor.execute(
            "UPDATE student SET about = %s WHERE id = %s",
            (about, student_id)
        )
        return cursor.rowcount > 0

def change_status_student_by_id(student_id: int, status: bool):
    with get_cursor() as cursor:
        cursor.execute(
            "UPDATE student SET is_blocked = %s WHERE id = %s",
            (status, student_id)
        )
        return cursor.rowcount > 0

def delete_student_by_id(student_id: int):
    with get_cursor() as cursor:
        cursor.execute("DELETE FROM student WHERE id = %s", (student_id,))
        return cursor.rowcount > 0