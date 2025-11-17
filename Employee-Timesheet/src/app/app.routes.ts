import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { ProjectComponent } from './pages/project/project.component';
import { TimesheetComponent } from './pages/timesheet/timesheet.component';
import { NavbarComponent } from './layout/navbar/navbar.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: NavbarComponent,
    children: [
      { path: 'employee', component: EmployeeComponent },
      { path: 'project', component: ProjectComponent },
      { path: 'timesheet', component: TimesheetComponent },
      { path: '', redirectTo: 'employee', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
