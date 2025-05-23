from lib.db import get_cursor

def get_lessons_by_module_id(module_id: int):
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM lesson WHERE module_id = %s", (module_id,))
        result = []
        lessons = cursor.fetchall()
        for lesson in lessons:
            lesson_dict = {
                "id": lesson[0],
                "title": lesson[1],
                "content": lesson[2],
                "module_id": lesson[3]
            }
            result.append(lesson_dict)
        return result

def get_lesson_by_id(lesson_id: int):
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM lesson WHERE id = %s", (lesson_id,))
        lesson = cursor.fetchone()
        if lesson:
            return {
                "id": lesson[0],
                "title": lesson[1],
                "content": lesson[2],
                "module_id": lesson[3]
            }
        return None

def insert_lesson(title: str, content: str, module_id: int):
    with get_cursor() as cursor:
        cursor.execute(
            "INSERT INTO lesson (title, content, module_id) VALUES (%s, %s, %s) RETURNING id",
            (title, content, module_id)
        )
        return cursor.fetchone()[0]

def update_lesson_by_id(lesson_id: int, title: str, content: str):
    with get_cursor() as cursor:
        cursor.execute(
            "UPDATE lesson SET title = %s, content = %s WHERE id = %s",
            (title, content, lesson_id)
        )
        return cursor.rowcount > 0

def delete_lesson_by_id(lesson_id: int):
    with get_cursor() as cursor:
        cursor.execute("DELETE FROM lesson WHERE id = %s", (lesson_id,))
        return cursor.rowcount > 0