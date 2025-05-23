from fastapi import APIRouter
from fastapi.responses import JSONResponse
from controllers.reports_controller import create_report
from controllers.student_controller import  get_student_by_id_t, update_student_bio, update_student_email_name
from models.user_models import ReportUser, UserInUpdate, UserInUpdateBio
from controllers.department_controller import get_departments_names_ids
from controllers.course_controller import get_all_courses
from controllers.enrollment_controller import get_enrolled_courses,enroll_user,unenroll_user,update_enrollment_progress

router = APIRouter()

@router.get("/getDepartments")
async def get_departments():
    try:
        response = get_departments_names_ids()
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
@router.get("/getCourses")
async def get_courses_route():
    try:
        response = get_all_courses()
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    


@router.get("/getEnrolledCourses/{student_id}")
async def get_enrolled_courses_route(student_id: int):
    try:
        response = get_enrolled_courses(student_id)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
    

@router.post("/enrollUser/{course_id}/{student_id}")
async def enroll_user_route(course_id: int, student_id: int):
    try:
        response = enroll_user(course_id, student_id)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    


@router.delete("/unenrollUser/{course_id}/{student_id}")
async def unenroll_user_route(course_id: int, student_id: int):
    try:
        response = unenroll_user(course_id, student_id)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    

@router.put("/updateEnrollmentProgress/{course_id}/{student_id}/{last_lesson_id}")
async def update_enrollment_progress_route(course_id: int, student_id: int, last_lesson_id: int):
    try:
        response = update_enrollment_progress(course_id, student_id, last_lesson_id)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    

@router.put("/changeemailname/{student_id}")
async def update_student_email_name_route(student_id: int,data : UserInUpdate):
    try:
        response = update_student_email_name(student_id, data.email, data.username)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
@router.put("/updatebio/{student_id}")
async def update_student_bio_route(student_id: int, data: UserInUpdateBio):
    try:
        response = update_student_bio(student_id, data.about)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    

@router.post("/report")
async def create_report_route(data: ReportUser):
    try:
        response = create_report(data.user_id, data.subject, data.content)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
@router.get("/getStudent/{student_id}")
async def get_student_route(student_id: int):
    try:
        response = get_student_by_id_t(student_id)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
