import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrjResponseDTO,ProjectService } from '../../services/project.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { TimesheetDTO, TimesheetService } from '../../services/timesheet.service';

@Component({
  selector: 'app-timesheet',
  imports: [CommonModule,ReactiveFormsModule,NgSelectModule],
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.css'
})
export class TimesheetComponent {
  constructor(private projectService:ProjectService,private timesheetService:TimesheetService,
    private fb:FormBuilder,private toastr:ToastrService){}
  timesheetForm!: FormGroup;
  projects:PrjResponseDTO[]=[];
  timesheets:TimesheetDTO[]=[];
  user :any;
  isLoading=false;
  isApproving=false;
  ngOnInit(): void {
    const userStr = localStorage.getItem('currentUser');
    this.user = userStr ? JSON.parse(userStr) : null;
    this.loadProjects();
    this.loadTimesheets();
    this.initForm();
  }
  initForm() {
    this.timesheetForm = this.fb.group({
      workDate: ['', Validators.required],
      description:['',Validators.required],
      hoursWorked: [null, [Validators.required, Validators.min(1)]],
      projectId: [this.projects[0]?.id || null, Validators.required] 
    });
  }
  loadProjects() {
    this.projectService.getAll().subscribe({
      next: (data) => {
      // FILTER PROJECTS BASED ON LOGGED IN USER ID
      this.projects = data.filter(prj =>
        prj.employeeIds.includes(this.user.id)
      );
    },
      error: (err) => console.error(err)
    });
  }
  loadTimesheets(){
    this.timesheetService.getAll().subscribe({
      next: (data) => {
        if (this.user.designation=='Admin')
        {
          this.timesheets=data;
        }
        else{
          const projectIds = this.projects.map(p => p.id);
          this.timesheets = data.filter(ts =>
            projectIds.includes(ts.projectId)
          );
        }
    },
      error: (err) => console.error(err)
    });
  }
  saveTimesheet()
  {
    if (this.timesheetForm.invalid) return;
    this.isLoading=true;
    const timesheet=this.timesheetForm.value;
    timesheet.employeeId=this.user.id;
    this.timesheetService.addTimesheet(timesheet).subscribe({
      next: (res) => {
        this.toastr.success('Timesheet added successfully!');
        this.timesheetForm.reset();
        this.loadTimesheets();
        this.isLoading = false;
        
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Adding timesheet failed','Error');
        this.isLoading = false;
      }
    });
  }
  approveTimeSheet(timesheet:TimesheetDTO){
    this.isApproving=true;
    this.timesheetService.approveTimesheet(timesheet.id).subscribe({
      next: (res) => {
        this.toastr.success('Timesheet approved successfully!');
        this.loadTimesheets();
        this.isApproving = false;
        
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Adding timesheet failed','Error');
        this.isApproving = false;
      }
    });
  }
}
