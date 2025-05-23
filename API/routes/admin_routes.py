from fastapi import APIRouter,HTTPException
from fastapi.responses import JSONResponse
from models.departement_models import DepartmentInUpdate
from controllers.department_controller import create_department,get_all_departments, get_students_by_department,update_department,delete_department
from controllers.student_controller import delete_student, block_student_tt,unblock_student
from controllers.course_controller import create_course, create_lesson, create_module, delete_lesson, delete_module,get_all_courses,get_course_by_id, get_lesson_by_id, get_module_by_id,update_course,delete_course, update_lesson, update_module
from controllers.reports_controller import delete_report, get_all_reports



router = APIRouter()


@router.post("/createDepartment")
async def create_department_route():
    try:
        response = create_department("Untitled Department", "No Description")
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
    
@router.put("/updateDepartment")
async def update_department_route(data : DepartmentInUpdate):
    try:
        response = update_department(data.id, data.name, data.description)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)


@router.delete("/deleteDepartment/{dept_id}")
async def delete_department_route(dept_id: int):
    try:
        response = delete_department(dept_id)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    

@router.get("/getDepartments")
async def get_departments():
    try:
        response = get_all_departments()
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
@router.get("/getStudents/{dept_id}")
async def get_students_by_department_route(dept_id: int):
    try:
        response = get_students_by_department(dept_id)
        return JSONResponse(content=response, status_code=200)
    except HTTPException as e:
        return JSONResponse(content={"error": e.detail}, status_code=e.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
@router.delete("/deleteStudent/{student_id}")
async def delete_student_route(student_id: int):
    try:
        response = delete_student(student_id)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    

@router.put("/blockStudent/{student_id}")
async def change_student_status_route(student_id: int, status: bool):
    try:
        response = block_student_tt(student_id)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
@router.put("/unblockStudent/{student_id}")
async def unblock_student_route(student_id: int):
    try:
        response = unblock_student(student_id)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    


@router.post("/createCourse")
async def create_course_route():
    try:
        response = create_course()
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)


@router.get("/getCourses")
async def get_courses_route():
    try:
        response = get_all_courses()
        return JSONResponse(content=response, status_code=200)
    except HTTPException as e:
        return JSONResponse(content={"error": e.detail}, status_code=e.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)


@router.get("/getCourse/{course_id}")
async def get_course_by_id_route(course_id: int):
    try:
        response = get_course_by_id(course_id)
        return JSONResponse(content=response, status_code=200)
    except HTTPException as e:
        return JSONResponse(content={"error": e.detail}, status_code=e.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)


@router.put("/updateCourse/{course_id}")
async def update_course_route(course_id: int, title: str, description: str, level: str, duration: str):
    try:
        response = update_course(course_id, title, description, level, duration)
        return JSONResponse(content=response, status_code=200)
    except HTTPException as e:
        return JSONResponse(content={"error": e.detail}, status_code=e.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)


@router.delete("/deleteCourse/{course_id}")
async def delete_course_route(course_id: int):
    try:
        response = delete_course(course_id)
        return JSONResponse(content=response, status_code=200)
    except HTTPException as e:
        return JSONResponse(content={"error": e.detail}, status_code=e.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)


@router.post("/createModule/{course_id}")
async def create_module_route(course_id: int):
    try:
        response = create_module(course_id)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)


@router.get("/getModule/{module_id}")
async def get_module_by_id_route(module_id: int):
    try:
        response = get_module_by_id(module_id)
        return JSONResponse(content=response, status_code=200)
    except HTTPException as e:
        return JSONResponse(content={"error": e.detail}, status_code=e.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)


@router.put("/updateModule/{module_id}")
async def update_module_route(module_id: int, title: str):
    try:
        response = update_module(module_id, title)
        return JSONResponse(content=response, status_code=200)
    except HTTPException as e:
        return JSONResponse(content={"error": e.detail}, status_code=e.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)


@router.delete("/deleteModule/{module_id}")
async def delete_module_route(module_id: int):
    try:
        response = delete_module(module_id)
        return JSONResponse(content=response, status_code=200)
    except HTTPException as e:
        return JSONResponse(content={"error": e.detail}, status_code=e.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)


@router.post("/createLesson/{module_id}")
async def create_lesson_route(module_id: int):
    try:
        response = create_lesson(module_id)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)


@router.get("/getLesson/{lesson_id}")
async def get_lesson_by_id_route(lesson_id: int):
    try:
        response = get_lesson_by_id(lesson_id)
        return JSONResponse(content=response, status_code=200)
    except HTTPException as e:
        return JSONResponse(content={"error": e.detail}, status_code=e.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)


@router.put("/updateLesson/{lesson_id}")
async def update_lesson_route(lesson_id: int, title: str, content: str):
    try:
        response = update_lesson(lesson_id, title, content)
        return JSONResponse(content=response, status_code=200)
    except HTTPException as e:
        return JSONResponse(content={"error": e.detail}, status_code=e.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)


@router.delete("/deleteLesson/{lesson_id}")
async def delete_lesson_route(lesson_id: int):
    try:
        response = delete_lesson(lesson_id)
        return JSONResponse(content=response, status_code=200)
    except HTTPException as e:
        return JSONResponse(content={"error": e.detail}, status_code=e.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

@router.get("/reports")
async def get_reports():
    try:
        response = get_all_reports()
        return JSONResponse(content=response, status_code=200)
    except HTTPException as e:
        return JSONResponse(content={"error": e.detail}, status_code=e.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
@router.delete("/deleteReport/{report_id}")
async def delete_report_route(report_id: int):
    try:
        response = delete_report(report_id)
        return JSONResponse(content=response, status_code=200)
    except HTTPException as e:
        return JSONResponse(content={"error": e.detail}, status_code=e.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)