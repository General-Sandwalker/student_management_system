import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8000/admin'; 

  constructor(private http: HttpClient) {}

  // Department
  createDepartment(): Observable<any> {
    return this.http.post(`${this.baseUrl}/createDepartment`, {});
  }

  updateDepartment(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateDepartment`, data);
  }

  deleteDepartment(deptId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteDepartment/${deptId}`);
  }

  getStudentsDep(deptId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getStudents/${deptId}`);
  }

  getDepartments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getDepartments`);
  }

  // Student
  deleteStudent(studentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteStudent/${studentId}`);
  }

  blockStudent(studentId: number, status: boolean): Observable<any> {
    const params = new HttpParams().set('status', status.toString());
    return this.http.put(`${this.baseUrl}/blockStudent/${studentId}`, {}, { params });
  }

  unblockStudent(studentId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/unblockStudent/${studentId}`, {});
  }

  // Course
  createCourse(): Observable<any> {
    return this.http.post(`${this.baseUrl}/createCourse`, {});
  }

  getCourses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getCourses`);
  }

  getCourseById(courseId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getCourse/${courseId}`);
  }

  updateCourse(courseId: number, title: string, description: string, level: string, duration: string): Observable<any> {
    const params = new HttpParams()
      .set('title', title)
      .set('description', description)
      .set('level', level)
      .set('duration', duration);
    return this.http.put(`${this.baseUrl}/updateCourse/${courseId}`, {}, { params });
  }

  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteCourse/${courseId}`);
  }

  // Module
  createModule(courseId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/createModule/${courseId}`, {});
  }

  getModuleById(moduleId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getModule/${moduleId}`);
  }

  updateModule(moduleId: number, title: string): Observable<any> {
    const params = new HttpParams().set('title', title);
    return this.http.put(`${this.baseUrl}/updateModule/${moduleId}`, {}, { params });
  }

  deleteModule(moduleId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteModule/${moduleId}`);
  }

  // Lesson
  createLesson(moduleId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/createLesson/${moduleId}`, {});
  }

  getLessonById(lessonId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getLesson/${lessonId}`);
  }

  updateLesson(lessonId: number, title: string, content: string): Observable<any> {
    const params = new HttpParams()
      .set('title', title)
      .set('content', content);
    return this.http.put(`${this.baseUrl}/updateLesson/${lessonId}`, {}, { params });
  }

  deleteLesson(lessonId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteLesson/${lessonId}`);
  }

  // Reports
  getReports(): Observable<any> {
    return this.http.get(`${this.baseUrl}/reports`);
  }

  deleteReport(reportId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteReport/${reportId}`);
  }
}