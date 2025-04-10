"""
This is the main entry point of the FastAPI application.
It sets up the app, includes the routes, and initializes the database tables.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import routes

# Initialize FastAPI app
app = FastAPI(
    title="Student Management System",
    description="A FastAPI backend for managing students, departments, and formations.",
    version="1.0.0"
)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Allow requests from frontend apps (adjust origins as needed)
origins = [
    "http://localhost:3000",  # Next.js frontend
    "http://localhost:8000",  # Swagger UI
    "http://localhost:4200"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000", "http://localhost:4200"],  # Your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include API routes
app.include_router(routes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Student Management System API!"}
