import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Student } from '../../../services/departements.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
    selector: 'app-student-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NzTableModule,
        NzButtonModule,
        NzTagModule,
        NzIconModule,
        NzModalModule,
        NzInputModule,
        NzSwitchModule
    ],
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StudentListComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private api: ApiService
    ) {}

    students: Student[] = [];
    searchText = '';

    ngOnInit(): void {
        this.loadStudents();
    }


    loadStudents(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            const numericId = Number(id);
            this.api.getStudentsDep(numericId).subscribe((data: any) => {
                this.students = data;
                console.log(this.students);
            });
        }
    }

    get filteredStudents() {
        if (!this.searchText) {
            return this.students;
        }
        return this.students.filter(student => 
            student.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
            student.email.toLowerCase().includes(this.searchText.toLowerCase())
        );
    }

    toggleBlock(student: Student): void {
        if (student.isBlocked) {
            this.api.unblockStudent(+student.id).subscribe(() => {
                student.isBlocked = false;
            });
        } else {
            this.api.blockStudent(+student.id, true).subscribe(() => {
                student.isBlocked = true;
            });
        }
    }

    deleteStudent(id: string): void {
        this.api.deleteStudent(+id).subscribe(() => {
            this.students = this.students.filter(student => student.id !== id);
        });
    }
}