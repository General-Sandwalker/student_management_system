import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { Department } from '../../services/departements.service';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzBadgeModule,
    NzTagModule,
    NzModalModule,
    NzListModule,
    NzAvatarModule,
    NzSwitchModule
  ],
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {
  searchTerm = '';
  depId = '';
  isLoading = true;
  dep : Department = { id: '', name: '', description: '' };
  originalDep!: Department;

  departments: Department[] = [];
  filteredDepartments: Department[] = [];

  constructor(
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  addDepartement(): void {
    this.api.createDepartment().subscribe((data) => {
      this.loadDepartments();
    });
  }

  tooggleEdit(depId: string): void {
    console.log(depId)
    this.depId = depId;
    const department = this.departments.find(dept => dept.id === depId);
    if (department) {
      this.dep = {
        ...department,
      };
      this.originalDep = {
        ...department,
      };
    }
  }

  toogleCancel(): void {
    if (this.dep.name === "Untitled Department") {
      this.api.deleteDepartment(Number(this.dep.id)).subscribe(() => {
        this.loadDepartments();
      });
    }
    this.dep = { id: '', name: '', description: '' };
    this.depId = '';
  }

  saveChanges(): void {
    this.api.updateDepartment(this.dep).subscribe(() => {
      if (this.dep.name === "Untitled Department") {
        this.api.deleteDepartment(Number(this.dep.id)).subscribe(() => {
          this.loadDepartments();
        });
      } else {
        this.loadDepartments();
      }
    });
    this.depId = '';
    this.dep = { id: '', name: '', description: '' };
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.api.getDepartments().subscribe((data: Department[]) => {
      this.departments = data;
      this.filteredDepartments = data;
      this.isLoading = false;
    }, error => {
      console.error('Error loading departments:', error);
      this.isLoading = false;
    });
  }

  filterDepartments(): void {
    if (!this.searchTerm) {
      this.filteredDepartments = [...this.departments];
    } else {
      this.filteredDepartments = this.departments.filter(dept =>
        dept.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        dept.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  navigateTo(id: string): void {
    this.router.navigateByUrl(`/department/students/${id}`);
  }

  deleteDepartment(id: string): void {
    this.api.deleteDepartment(Number(id)).subscribe(() => {
      this.departments = this.departments.filter(department => department.id !== id);
      this.filteredDepartments = this.filteredDepartments.filter(department => department.id !== id);
      this.loadDepartments();
    }, error => {
      console.error('Error deleting department:', error);
    });
  }
}