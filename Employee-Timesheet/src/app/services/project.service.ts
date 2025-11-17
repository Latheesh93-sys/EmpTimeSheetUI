import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AddProjectDTO {
  name: string;
  startDate: string;
  endDate: string;
  primarymanager: string;
  secondarymanager: string;
  employeeIds: number[];
}

export interface PrjResponseDTO{
  id :  number;
  name : string;
  primarymanager : string;
  secondarymanager : string;
  startDate : string;
  endDate: string;
  employeeIds : number[];
  employeeNames?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'https://localhost:7184/api/project';

  constructor(private http: HttpClient) {}

  addProject(project: AddProjectDTO): Observable<any> {
    return this.http.post(this.apiUrl, project);
  }
  getAll(): Observable<PrjResponseDTO[]> {
      return this.http.get<PrjResponseDTO[]>(this.apiUrl);
  }
  update(id: number, project: AddProjectDTO): Observable<PrjResponseDTO> {
    return this.http.put<PrjResponseDTO>(`${this.apiUrl}/${id}`, project);
  }
}