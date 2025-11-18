import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
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

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
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
  getPaginatedEmployees(
    filters: {
      name?: string;
      designation?: string;
      sortBy?: string;
      sortOrder?: string;
      pageNumber?: number;
      pageSize?: number;
    }
  ): Observable<PaginatedResult<EmpResponseDTO>> {
    let params = new HttpParams().set('name', filters.name??'All');
    if (filters.designation) {
      params = params.set('designation', filters.designation??'All');
    }
    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
    if (filters.sortOrder) {
      params = params.set('sortOrder', filters.sortOrder);
    }
    if (filters.pageNumber) {
      params = params.set('pageNumber', filters.pageNumber.toString());
    }
    if (filters.pageSize) {
      params = params.set('pageSize', filters.pageSize.toString());
    }

    return this.http.get<PaginatedResult<EmpResponseDTO>>(`${this.apiUrl}/paginated`, { params });
  }
}
