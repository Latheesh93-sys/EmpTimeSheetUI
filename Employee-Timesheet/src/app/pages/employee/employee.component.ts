import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService, AddEmployeeDTO, EmpResponseDTO } from '../../services/employee.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee',
  imports:[CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employees: EmpResponseDTO[] = [];
  isLoading: boolean = false;
  // Filters
  filter = {
    name: '',
    designation: '',
    sortBy: 'name',
    sortOrder: 'desc',
    pageNumber: 1,
    pageSize: 5,
  };
  totalCount=0;
  user:any;

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
    const userStr = localStorage.getItem('currentUser');
    this.user = userStr ? JSON.parse(userStr) : null;
    this.loadData();
  }

  loadEmployees() {
    this.employeeService.getAll().subscribe({
      next: (data) => (this.employees = data),
      error: (err) => console.error(err)
    });
  }
  loadData() {
    this.employeeService.getPaginatedEmployees(this.filter).subscribe((res) => {
      this.employees = res.items;
      this.totalCount = res.totalCount;
    });
  }
  onPageChange(page: number) {
    this.filter.pageNumber = page;
    this.loadData();
  }

  onFilterChange() {
    this.filter.pageNumber = 1;
    this.loadData();
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
