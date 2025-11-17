import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AddEmployeeDTO {
  name: string;
  email: string;
  password: string;
  designation: string;
}

export interface EmpResponseDTO {
  id: number;
  name: string;
  email: string;
  designation: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://localhost:7184/api/employee'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<EmpResponseDTO[]> {
    return this.http.get<EmpResponseDTO[]>(this.apiUrl);
  }

  add(employee: AddEmployeeDTO): Observable<EmpResponseDTO> {
    return this.http.post<EmpResponseDTO>(this.apiUrl, employee);
  }
}
