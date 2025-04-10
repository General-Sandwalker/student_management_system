# Backend README

This document provides an overview of the backend system for the Student Management System. The backend is built using FastAPI and SQLAlchemy, providing a RESTful API for managing students, departments, formations, and admin functionalities.

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Database Models](#database-models)
3. [API Routes](#api-routes)
4. [Authentication](#authentication)
5. [Testing](#testing)

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd backend
   ```
2. **Create a virtual environment and activate it:**

   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
3. **Install the dependencies:**

   ```bash
   pip install -r requirements.txt
   ```
4. **Run the application:**

   ```bash
   uvicorn main:app --reload
   ```

## Database Models

The backend uses SQLAlchemy models to define the following entities:

- **Student**: Represents a student with fields like id, name, email, etc.
- **Department**: Represents a department with fields like id, name, and a relationship to students.
- **Formation**: Represents a formation with fields like id, title, and a relationship to students.

## API Routes

The API provides the following routes:

- **Student Routes**: For managing student data.
- **Department Routes**: For managing department data.
- **Formation Routes**: For managing formation data.
- **Admin Routes**: For admin-specific functionalities.

## Authentication

The backend uses JWT tokens for authentication. The following endpoints require authentication:

- `GET /students/me`: Retrieves the current student's profile.
- `GET /admin/stats`: Retrieves statistics for admin users.

## Testing

To run the tests, execute the following command:

http://localhost:8000/docs

