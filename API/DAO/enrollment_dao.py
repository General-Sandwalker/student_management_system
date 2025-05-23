from lib.db import get_cursor

def enroll_user(course_id: int, user_id: int):
    with get_cursor() as cursor:
        cursor.execute(
            "INSERT INTO enrollment (course_id, user_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
            (course_id, user_id)
        )
        return cursor.rowcount > 0

def update_enrollment_progress(course_id: int, user_id: int, last_lesson_id: int):
    with get_cursor() as cursor:
        cursor.execute(
            "UPDATE enrollment SET last_lesson_id = %s, last_activity_date = CURRENT_DATE WHERE course_id = %s AND user_id = %s",
            (last_lesson_id, course_id, user_id)
        )
        return cursor.rowcount > 0

def get_user_enrollments(user_id: int):
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM enrollment WHERE user_id = %s", (user_id,))
        result = []
        enrollments = cursor.fetchall()
        for enrollment in enrollments:
            enrollment_dict = {
                "course_id": enrollment[0],
                "user_id": enrollment[1],
                "last_lesson_id": enrollment[2],
                "last_activity_date": enrollment[4].isoformat() if enrollment[4] else None
            }
            result.append(enrollment_dict)
        return result

def unenroll_user(course_id: int, user_id: int):
    with get_cursor() as cursor:
        cursor.execute("DELETE FROM enrollment WHERE course_id = %s AND user_id = %s", (course_id, user_id))
        return cursor.rowcount > 0
