# Student Management System API

# 🎓 Student Management System API

This **FastAPI-based backend** provides endpoints to manage students, formations, departments, and admin functionalities for a student management system.

## ✨ Features

- 🔐 **Student Registration & Login** with JWT Authentication
- 📚 **Formation Enrollment** & Unenrollment
- 🛠️ **Admin Authentication** & Management of Reports and Formations
- 🔄 **CORS Enabled** for local development with Angular/React

## 🛠 Technologies Used

- ⚡ FastAPI
- 🗃 MongoDB with Motor (Async driver)
- 🔐 JWT Authentication
- 🛡 Passlib for password hashing
- ⚛️ Next.js for the production app
- 🅰️ Angular for the admin panel

## 📦 Installation

1. 📁 Clone the repository.
2. 📥 Install the requirements:

```bash
cd ./API
pip install -r requirements.txt
cd ../adminPanel
npm i
ng add @angular/material
cd ../Kratos-University
npm i
```

3. Set your MongoDB URI in the code:

```python
motor.motor_asyncio.AsyncIOMotorClient("your_mongo_uri")
```

4. Run the FastAPI app:

```bash
uvicorn main:app --reload --port 8000 #make sure you have opened venv / install all required packages
cd ../adminPanel | ng serve
cd ../Kratos-University | npm run dev
```

## 📁 API Endpoints

### 🎓 Student Endpoints

| Method | Endpoint                          | Description |
|--------|-----------------------------------|-------------|
| POST   | `/student/register`               | Register a new student |
| POST   | `/student/login`                  | Login with email & password |
| GET    | `/student/check/{token}`          | Validate JWT token |
| POST   | `/student/logout`                 | Dummy logout |
| GET    | `/student/{uid}`                  | Fetch student profile |
| GET    | `/student/ownformations/{uid}`    | List student's formations |
| GET    | `/student/formations/{departmentId}` | List formations by department theme |
| POST   | `/student/enrollformation/{code}` | Enroll in formation |
| DELETE | `/student/quitformation`          | Unenroll from formation |

### 🛠️ Admin Endpoints

| Method | Endpoint                            | Description |
|--------|-------------------------------------|-------------|
| POST   | `/admin/authentication`             | Authenticate as admin |
| GET    | `/admin/check`                      | Check admin token |
| POST   | `/admin/logout`                     | Dummy logout |
| POST   | `/adminreport`                      | Add a report |
| GET    | `/admin/reports`                    | Get all reports |
| DELETE | `/admin/deletereport/{report_id}`   | Delete a report |
| GET    | `/admin/formations`                 | Get all formations |
| POST   | `/admin/addformation`               | Add a new formation |
| PUT    | `/admin/updateformation/{formation_id}` | Update formation |
| DELETE | `/admin/deleteformation/{formation_id}` | Delete formation |
| GET    | `/admin/allstudents`                | Get all students with info |

## 🔐 Security

- Passwords are hashed using Bcrypt.
- JWT is used for authentication and token expiration.

## 🔄 License

This project is open-source and free to use.
