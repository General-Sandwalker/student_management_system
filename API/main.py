from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth_routes,admin_routes,student_routes,recommendations,summary,stats
import lib.db as db

app = FastAPI()

# Middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db.create_tables_if_not_exist()

# Include routers
app.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
app.include_router(admin_routes.router, prefix="/admin", tags=["Admin"])
app.include_router(student_routes.router, prefix="/student", tags=["Student"])
app.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
app.include_router(summary.router, prefix="/summary", tags=["Summary"])
app.include_router(stats.router, prefix="/stats", tags=["Stats"])