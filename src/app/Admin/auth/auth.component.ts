import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from './Services/auth-service.service';
import { Router } from '@angular/router';
import { ToastServiceService } from '../../Services/toast-service.service';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(
    private fb: FormBuilder, 
    private authService: AuthServiceService,
    private router: Router,
    private toastService: ToastServiceService,
  ) { }

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginFormFunction();
  }

  loginFormFunction() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  formSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
  
      this.authService.login(email, password).subscribe({
        next: (user) => {
          console.log('Login successful:', user);
          this.toastService.success('Login Successful', 'Welcome Back');
          this.router.navigate(['admin', 'dashboard']);
        },
        error: (error) => {
          console.error('Login failed:', error.message);
          this.toastService.error('Login failed', 'User not found');
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }  
}