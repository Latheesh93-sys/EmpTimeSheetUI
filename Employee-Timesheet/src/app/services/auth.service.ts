import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'token';
  constructor(private http:HttpClient) { }
  login(email: string, password: string) {
    return this.http.post<{ token: string }>('https://localhost:7184/api/Auth/login', {
      email,
      password
    });
  }
  saveToken(response: any) {
    // Save data to localStorage
    localStorage.setItem('token',response.token);
    const userData = {
    id: response.id,
    designation: response.designation
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }
}
