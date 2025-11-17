import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService, AddEmployeeDTO, EmpResponseDTO } from '../../services/employee.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee',
  imports:[CommonModule,ReactiveFormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employees: EmpResponseDTO[] = [];
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, 
    private employeeService: EmployeeService, private toastr:ToastrService) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required, Validators.minLength(6)]],
      designation: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAll().subscribe({
      next: (data) => (this.employees = data),
      error: (err) => console.error(err)
    });
  }

  onSubmit() {
    if (this.employeeForm.invalid) return;

    this.isLoading = true;
    const employee: AddEmployeeDTO = {
  email: this.employeeForm.get('userEmail')?.value,
  name:this.employeeForm.get('name')?.value,
  password:this.employeeForm.get('userPassword')?.value,
  designation:this.employeeForm.get('designation')?.value
};

    this.employeeService.add(employee).subscribe({
      next: (data) => {
        this.employees.push(data); 
        this.employeeForm.reset();
        this.isLoading = false;
        this.toastr.success('Employee added successfully!');
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Adding employee failed','Error');
        this.isLoading = false;
      }
    });
  }
}
