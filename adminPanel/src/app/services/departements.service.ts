import { Injectable } from '@angular/core';

export interface Student {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class DepartmentsService {

  private departements: Department[] = [
    {
      id: '1',
      name: 'Computer Science',
      description: 'Department of Computer Science and Engineering',
      // students: [
      //   { id: 's1', name: 'Alice Smith', email: 'alice@example.com', isBlocked: false },
      //   { id: 's2', name: 'Bob Johnson', email: 'bob@example.com', isBlocked: false }
      // ]
    },
    {
      id: '2',
      name: 'Mathematics',
      description: 'Department of Mathematics',
      // students: [
      //   { id: 's3', name: 'Charlie Brown', email: 'charlie@example.com', isBlocked: true }
      // ]
    }
  ];

getAllDepartements(): Department[] {
  return [...this.departements];
}

getDepartementById(id: string): Department | undefined {
  return this.departements.find(dep => dep.id === id);
}

addDepartement(departement: Department): void {
  this.departements.push(departement);
}

updateDepartement(id: string, updatedDepartement: Department): boolean {
  const index = this.departements.findIndex(dep => dep.id === id);
  if (index !== -1) {
    this.departements[index] = updatedDepartement;
    return true;
  }
  return false;
}

deleteDepartment(id: string): boolean {
  const index = this.departements.findIndex(dep => dep.id === id);
  if (index !== -1) {
    this.departements.splice(index, 1);
    return true;
  }
  return false;
}


// getAllStudentsFromDepartement(departmentId: string): Student[] {
//     const departement = this.departements.find(dep => dep.id === departmentId);
//     if (!departement) {
//         throw new Error(`Departement with id ${departmentId} not found.`);
//     }
//     return [...departement.students];
// }

// blockStudent(studentId: string): void {
//   for (let dep of this.departements) {
//     const student = dep.students.find(s => s.id === studentId);
//     if (student) {
//       student.isBlocked = true;
//       return;
//     }
//   }
// }
}
