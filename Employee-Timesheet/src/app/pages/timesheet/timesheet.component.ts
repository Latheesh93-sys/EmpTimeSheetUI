import { Component } from '@angular/core';
import { PrjResponseDTO,ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-timesheet',
  imports: [],
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.css'
})
export class TimesheetComponent {
  constructor(private projectService:ProjectService){}
  projects:PrjResponseDTO[]=[];
ngOnInit(): void {
    const userStr = localStorage.getItem('currentUser');
    const user = userStr ? JSON.parse(userStr) : null;
    console.log(user.designation);
    this.loadProjects();
  }
  loadProjects() {
    this.projectService.getAll().subscribe({
      next: (data) => (this.projects = data),
      error: (err) => console.error(err)
    });
  }
}
