from fastapi import HTTPException
from DAO import course_dao, module_dao, lesson_dao


# ----------------------------- COURSE HANDLERS -----------------------------

def create_course():
    new_id = course_dao.insert_course("Untitled", "Nothing", "beginner", "0 week")

    return {"course":{
        "id": new_id,
        "title": "Untitled",
        "description": "Nothing",
        "level": "beginner",
        "duration": "0 week"
    }, "message": "Course created successfully"}


def get_all_courses():
    courses = course_dao.get_all_courses()
    if not courses:
        raise HTTPException(status_code=404, detail="No courses found")

    for course in courses:
        course["modules"] = module_dao.get_modules_by_course_id(course["id"])
        for module in course["modules"]:
            module["lessons"] = lesson_dao.get_lessons_by_module_id(module["id"])
    return courses


def get_course_by_id(course_id: int):
    course = course_dao.get_course_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    course["modules"] = module_dao.get_modules_by_course_id(course_id)
    for module in course["modules"]:
        module["lessons"] = lesson_dao.get_lessons_by_module_id(module["id"])
    return course


def update_course(course_id: int, title: str, description: str, level: str, duration: str):
    if not course_dao.update_course_by_id(course_id, title, description, level, duration):
        raise HTTPException(status_code=404, detail="Course not found")
    return {"message": "Course updated successfully"}


def delete_course(course_id: int):
    if not course_dao.delete_course_by_id(course_id):
        raise HTTPException(status_code=404, detail="Course not found")
    return {"message": "Course deleted successfully"}


# ----------------------------- MODULE HANDLERS -----------------------------

def create_module(course_id: int):
    new_id = module_dao.insert_module("Untitled", course_id)
    return {"id": new_id, "message": "Module created successfully"}


def get_module_by_id(module_id: int):
    module = module_dao.get_module_by_id(module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    module["lessons"] = lesson_dao.get_lessons_by_module_id(module_id)
    return module


def update_module(module_id: int, title: str):
    if not module_dao.update_module_by_id(module_id, title):
        raise HTTPException(status_code=404, detail="Module not found")
    return {"message": "Module updated successfully"}


def delete_module(module_id: int):
    if not module_dao.delete_module_by_id(module_id):
        raise HTTPException(status_code=404, detail="Module not found")
    return {"message": "Module deleted successfully"}


# ----------------------------- LESSON HANDLERS -----------------------------

def create_lesson(module_id: int):
    new_id = lesson_dao.insert_lesson("Untitled", "", module_id)
    return {"id": new_id, "message": "Lesson created successfully"}


def get_lesson_by_id(lesson_id: int):
    lesson = lesson_dao.get_lesson_by_id(lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson


def update_lesson(lesson_id: int, title: str, content: str):
    if not lesson_dao.update_lesson_by_id(lesson_id, title, content):
        raise HTTPException(status_code=404, detail="Lesson not found")
    return {"message": "Lesson updated successfully"}


def delete_lesson(lesson_id: int):
    if not lesson_dao.delete_lesson_by_id(lesson_id):
        raise HTTPException(status_code=404, detail="Lesson not found")
    return {"message": "Lesson deleted successfully"}
