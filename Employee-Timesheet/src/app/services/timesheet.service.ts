import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AddTimesheetDTO {
  projectId: number;
  employeeId: number;
  hoursWorked: number;
  date: string;
  description:string;
}
export interface TimesheetDTO{
  id:number;
  projectId:number;
  projectName:string;
  employeeName:string;
  hoursWorked: number;
  date: string;
  isApproved:boolean;
  description:string;
}
@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  private apiUrl = 'https://localhost:7184/api/timesheet';

  constructor(private http: HttpClient) {}

  addTimesheet(timesheet: AddTimesheetDTO): Observable<any> {
      return this.http.post(this.apiUrl, timesheet);
  }
  getAll(): Observable<TimesheetDTO[]> {
        return this.http.get<TimesheetDTO[]>(this.apiUrl);
  }
   approveTimesheet(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {});
  }
}
