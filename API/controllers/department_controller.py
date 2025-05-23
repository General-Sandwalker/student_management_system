from fastapi import HTTPException
from DAO import department_dao , student_dao


def create_department(name: str, description: str):
    new_id = department_dao.insert_department(name, description)
    return new_id

def get_all_departments():
    departments = department_dao.get_all_departments()
    if not departments:
        raise HTTPException(status_code=404, detail="No departments found")
    return departments

def get_students_by_department(dept_id: int):
    students = student_dao.get_students_by_department(dept_id)
    if not students:
        raise HTTPException(status_code=404, detail="No students found for this department")
    return students

def update_department(dept_id: int, name: str, description: str):
    updated = department_dao.update_department(dept_id, name, description)
    if not updated:
        raise HTTPException(status_code=404, detail="Update failed")
    return {"message": "Department updated successfully"}


def delete_department(dept_id: int):
    deleted = department_dao.delete_department(dept_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Delete failed")
    return {"message": "Department deleted successfully"}

def get_departments_names_ids():
    departments = department_dao.get_all_departments()
    result = [{"id": department["id"], "name": department["name"]} for department in departments]
    return result
