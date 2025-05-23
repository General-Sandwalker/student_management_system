import { Component, OnInit } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Course } from '../../services/courses.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [FormsModule,NzDividerModule,NzTableModule,NzButtonModule,NzIconModule,NzInputModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  constructor(
    private router: Router,
    private api: ApiService
  ) {}

  searchTerm: string = '';
  courses: Course[] = [];
  filteredCourses: Course[] = [];


  ngOnInit(): void {
    this.api.getCourses().subscribe((data: Course[]) => {
      this.courses = data;
      this.filteredCourses = data;
    });
  }


  filterCourses(): void {
    if (this.searchTerm) {
      this.filteredCourses = this.courses.filter(course =>
        course.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredCourses = this.courses;
    }
  }

  deleteCourse(courseId: any): void {
    this.api.deleteCourse(courseId).subscribe(() => {
      this.courses = this.courses.filter(course => +course.id !== courseId);
      this.filteredCourses = this.filteredCourses.filter(course => +course.id !== courseId);
    });
  }

  navigateTo(courseId :any):void{
    this.router.navigateByUrl(`/courses/${courseId}`);
  }
}