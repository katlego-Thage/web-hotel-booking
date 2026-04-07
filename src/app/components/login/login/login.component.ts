import { CommonModule } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { isPlatformBrowser } from '@angular/common';
import { LoginRequest } from '../../../models';
import { Auth } from '../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../services/notification';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };
  
  registerData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  hidePassword = true;
  hideRegPassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  errorMessage = '';
  activeTab = 0;
  // returnUrl: string = '/';
  returnUrl: string = '/app/dashboard';
  
  constructor(
    private authService: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService 
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // if (this.authService.isAuthenticated) {
    //   this.router.navigate([this.returnUrl]);
    // }
    if (this.authService.isAuthenticated) {
  this.router.navigate([this.returnUrl]);
}
  }

  onLogin(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationService.success('Login successful!');
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error || 'Invalid email or password';
        this.notificationService.error(this.errorMessage);
      }
    });
  }

  onRegister(): void {
    if (!this.registerData.username || !this.registerData.email || !this.registerData.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.registerData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register({
      username: this.registerData.username,
      email: this.registerData.email,
      password: this.registerData.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationService.success('Account created successfully!'); 
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error || 'Failed to create account';
        this.notificationService.error(this.errorMessage);
      }
    });
  }
}