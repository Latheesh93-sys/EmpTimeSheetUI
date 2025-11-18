import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { EmployeeService, EmpResponseDTO } from '../../services/employee.service';
import { ProjectService, AddProjectDTO, PrjResponseDTO } from '../../services/project.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

type FormMode = 'INSERT' | 'EDIT';

@Component({
  selector: 'app-project',
  imports:[CommonModule,ReactiveFormsModule,NgSelectModule],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  projectForm!: FormGroup;
  formMode: FormMode = 'INSERT';
  employees: EmpResponseDTO[] = [];
  projects : PrjResponseDTO[]=[];
  employeeMap: { [id: number]: EmpResponseDTO } = {};
  editingProjectId?: number;
  isLoading = false;
  user:any;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private projectService: ProjectService,
    private toastr:ToastrService
  ) {}

  ngOnInit():void{
    const userStr = localStorage.getItem('currentUser');
    this.user = userStr ? JSON.parse(userStr) : null;
    this.initForm();
    this.loadEmployeesProjects();
  }


  initForm() {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      primaryManager: ['', Validators.required],
      secondaryManager: ['', Validators.required],
      employeeIds: [[], Validators.required] // multi-select
    });
  }

  loadEmployeesProjects() {
    forkJoin({
      employees: this.employeeService.getAll(),   
      projects: this.projectService.getAll()      
    }).subscribe(({ employees, projects }) => {

      this.employees = employees;

      // Build employee map
      this.employeeMap = {};
      employees.forEach(e => this.employeeMap[e.id] = e);

      // Map employee names into projects
      this.projects = projects.map(p => ({
        ...p,
        employeeNames: p.employeeIds
          .map(id => this.employeeMap[id]?.name)
          .join(', ')
      }));
    });
  }
  
  saveProject()
  {
    if (this.projectForm.invalid) return;
    this.isLoading = true;
    if(this.formMode==='INSERT'){
    const project: AddProjectDTO = this.projectForm.value;
    this.projectService.addProject(project).subscribe({
      next: (res) => {
        this.toastr.success('Project added successfully!');
        this.projectForm.reset();
        this.loadEmployeesProjects();
        this.isLoading = false;
        
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Adding project failed','Error');
        this.isLoading = false;
      }
    });
    }
    else if (this.formMode === 'EDIT' && this.editingProjectId) {
      this.projectService.update(this.editingProjectId,this.projectForm.value).subscribe({
      next: (res) => {
        this.toastr.success('Project updated successfully!');
        this.loadEmployeesProjects();
        this.isLoading = false;
        this.cancelEdit();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Updating project failed','Error');
        this.isLoading = false;
      }
    });

    }
  }
  editProject(project: PrjResponseDTO) {
    this.formMode = 'EDIT';
    this.editingProjectId = project.id;
    this.projectForm = this.fb.group({
      name: [project.name, Validators.required],
      startDate: [this.formatDate(project.startDate), Validators.required],
      endDate: [this.formatDate(project.endDate), Validators.required],
      primaryManager: [project.primarymanager, Validators.required],
      secondaryManager: [project.secondarymanager, Validators.required],
      employeeIds: [[...project.employeeIds], Validators.required] // multi-select
    });
  }
   cancelEdit() {
    this.formMode = 'INSERT';
    this.editingProjectId = undefined;
    this.initForm();
  }
  formatDate(dateStr: string | Date): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
  }
}
