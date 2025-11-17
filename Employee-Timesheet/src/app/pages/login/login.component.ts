import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(private auth: AuthService, private router: Router, private toastr:ToastrService) {}

  onLogin() {
    this.isLoading=true;
  this.auth.login(this.username, this.password).subscribe({
    next: (res) => {
      this.isLoading = false;
      this.auth.saveToken(res);
      this.toastr.success('Login Successful');
      this.router.navigateByUrl('/employee');
    },
    error: () => {
      this.isLoading=false;
      this.toastr.error('Invalid Username or Password','Login Failed');
    }
  });
}
}