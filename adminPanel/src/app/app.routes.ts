import { Routes } from '@angular/router';
import { CourseListComponent } from './comp/Courses/course-list.component';
import { CourseDetailsComponent } from './comp/Courses/CourseDetails/course-details.component';
import { DepartmentListComponent } from "./comp/Departements/department-list.component";
import { StudentListComponent } from "./comp/Departements/Students/student-list.component";
import { InboxComponent } from './comp/Inbox/inbox.component';
import { StatsComponent } from './comp/Stats/stats.component';

export const routes: Routes = [
    { path: "courses", component: CourseListComponent },
    { path: "courses/:id", component: CourseDetailsComponent },
    { path: "department", component: DepartmentListComponent },
    { path: "department/students/:id", component: StudentListComponent },
    { path: "inbox", component: InboxComponent },
    { path: "stats", component: StatsComponent},
    { path: "", redirectTo: "courses", pathMatch: "full" },

];

