from fastapi import APIRouter
from fastapi.responses import JSONResponse
from controllers.auth_controller import login, register, checkAuth
from models.user_models import UserInLogin, UserInRegister

router = APIRouter()


@router.post("/login")
async def login_user(data: UserInLogin):
    try:
        response = login(data)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
@router.post("/register")
async def register_user(data: UserInRegister):
    try:
        response = register(data)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

@router.get("/checkAuth/{token}")
async def check_auth(token: str):
    try:
        response = checkAuth(token)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

@router.get("/logout")
async def logout():
    try:
        return JSONResponse(content={"message": "Logged out successfully"}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)





