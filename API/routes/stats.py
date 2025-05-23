from fastapi import APIRouter
from typing import List, Dict
from lib.db import get_cursor

router = APIRouter()

@router.get("/department", response_model=Dict[str, List])
def get_department_stats():
    with get_cursor() as cur:
        query = """
            SELECT d.name, COUNT(s.id) as student_count
            FROM department d
            LEFT JOIN student s ON d.id = s.department_id
            GROUP BY d.name
            ORDER BY student_count DESC
            LIMIT 4
        """
        cur.execute(query)
        result = cur.fetchall()
        
        labels = [row[0] for row in result] if result else []
        data = [row[1] for row in result] if result else []
        
        return {"labels": labels, "data": data}

@router.get("/courses", response_model=Dict[str, List])
def get_course_stats():
    with get_cursor() as cur:
        query = """
            SELECT c.title, COUNT(e.user_id) as enrollment_count
            FROM course c
            LEFT JOIN enrollment e ON c.id = e.course_id
            GROUP BY c.title
            ORDER BY enrollment_count DESC
            LIMIT 5
        """
        cur.execute(query)
        result = cur.fetchall()
        
        labels = [row[0] for row in result] if result else []
        data = [row[1] for row in result] if result else []
        
        return {"labels": labels, "data": data}

@router.get("/completion", response_model=Dict[str, List])
def get_completion_stats():
    with get_cursor() as cur:
        total_enrollments_query = "SELECT COUNT(*) FROM enrollment"
        completed_query = """
            SELECT COUNT(*) 
            FROM enrollment 
            WHERE last_lesson_id IS NOT NULL 
            AND last_activity_date >= CURRENT_DATE - INTERVAL '30 days'
        """
        
        cur.execute(total_enrollments_query)
        total_enrollments = cur.fetchone()[0] or 0
        
        cur.execute(completed_query)
        completed = cur.fetchone()[0] or 0
        
        incomplete = total_enrollments - completed
        
        return {
            "labels": ["Completed", "Incomplete"],
            "data": [completed, incomplete]
        }