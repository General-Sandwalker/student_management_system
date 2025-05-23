from lib.db import get_cursor
from DAO import student_dao

def submit_report(user_id: int, subject: str, content: str):
    with get_cursor() as cursor:
        cursor.execute(
            "INSERT INTO reports (user_id, subject, content) VALUES (%s, %s, %s) RETURNING id",
            (user_id, subject, content)
        )
        return cursor.fetchone()[0]

def get_reports_by_user(user_id: int):
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM reports WHERE user_id = %s", (user_id,))
        return cursor.fetchall()

def get_unread_reports():
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM reports WHERE read = FALSE")
        return cursor.fetchall()

def mark_report_as_read(report_id: int):
    with get_cursor() as cursor:
        cursor.execute("UPDATE reports SET read = TRUE WHERE id = %s", (report_id,))
        return cursor.rowcount > 0

def delete_report(report_id: int):
    with get_cursor() as cursor:
        cursor.execute("DELETE FROM reports WHERE id = %s", (report_id,))
        return cursor.rowcount > 0

def get_all_reports():
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM reports")
        result = []
        reports = cursor.fetchall()
        for report in reports:
            print(report)
            report_dict = {
                "id": report[0],
                "email":student_dao.get_student_by_id(report[1])["email"],
                "subject": report[2],
                "content": report[3],
                "created_at": report[5].strftime("%Y-%m-%d")
            }
            result.append(report_dict)
        return result

def get_report_by_id(report_id: int):
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM reports WHERE id = %s", (report_id,))
        report = cursor.fetchone()
        if report:
            return {
                "id": report[0],
                "title": report[1],
                "content": report[2],
                "created_at": report[3]
            }
        return None

def delete_report_by_id(report_id: int):
    with get_cursor() as cursor:
        cursor.execute("DELETE FROM reports WHERE id = %s", (report_id,))
        return cursor.rowcount > 0