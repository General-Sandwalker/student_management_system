from lib.db import get_cursor

def get_course_by_id(course_id: int):
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM course WHERE id = %s", (course_id,))
        course = cursor.fetchone()
        if course:
            return {
                "id": course[0],
                "title": course[1],
                "description": course[2],
                "level": course[3],
                "duration": course[4]
            }
        return None

def get_all_courses():
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM course")
        result = []
        courses = cursor.fetchall()
        for course in courses:
            course_dict = {
                "id": course[0],
                "title": course[1],
                "description": course[2],
                "level": course[3],
                "duration": course[4]
            }
            result.append(course_dict)
        return result

def insert_course(title: str, description: str, level: str, duration: str):
    with get_cursor() as cursor:
        cursor.execute(
            "INSERT INTO course (title, description, level, duration) VALUES (%s, %s, %s, %s) RETURNING id",
            (title, description, level, duration)
        )
        return cursor.fetchone()[0]

def update_course_by_id(course_id: int, title: str, description: str, level: str, duration: str):
    with get_cursor() as cursor:
        cursor.execute(
            "UPDATE course SET title = %s, description = %s, level = %s, duration = %s WHERE id = %s",
            (title, description, level, duration, course_id)
        )
        return cursor.rowcount > 0

def delete_course_by_id(course_id: int):
    with get_cursor() as cursor:
        cursor.execute("DELETE FROM course WHERE id = %s", (course_id,))
        return cursor.rowcount > 0
