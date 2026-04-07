import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../models';
import { UserService } from '../../../services';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})

export class UserFormComponent implements OnInit {
  user: Partial<User> = {
    username: '',
    email: '',
    roleID: 4 // Default to Customer
  };
  password = '';
  hidePassword = true;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  userId: number | null = null;

  roles = [
    { id: 1, name: 'Admin', icon: 'admin_panel_settings' },
    { id: 2, name: 'Manager', icon: 'manage_accounts' },
    { id: 3, name: 'Receptionist', icon: 'support_agent' },
    { id: 4, name: 'Customer', icon: 'person' }
  ];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    if (this.userId) {
      this.isEditMode = true;
      this.loadUser(this.userId);
    }
  }

  loadUser(id: number): void {
    this.isLoading = true;
    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.user = {
          userID: user.userID,
          username: user.username,
          email: user.email,
          roleID: user.roleID
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load user: ' + error.message, 'Close', { duration: 5000 });
        this.isLoading = false;
        this.router.navigate(['/users']);
      }
    });
  }

  onSubmit(): void {
    if (!this.user.username || !this.user.email) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    if (!this.isEditMode && !this.password) {
      this.snackBar.open('Please enter a password', 'Close', { duration: 3000 });
      return;
    }

    this.isSaving = true;

    if (this.isEditMode && this.userId) {
      // Update existing user
      const updateData = {
        userID: this.userId,
        username: this.user.username!,
        email: this.user.email!,
        roleID: this.user.roleID
      };
      
      this.userService.updateUser(this.userId, updateData).subscribe({
        next: () => {
          this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.snackBar.open('Failed to update user: ' + error.message, 'Close', { duration: 5000 });
          this.isSaving = false;
        }
      });
    } else {
      // Create new user
      const createData = {
        username: this.user.username!,
        email: this.user.email!,
        passwordHash: this.password,
        roleID: this.user.roleID
      };
      
      this.userService.createUser(createData).subscribe({
        next: () => {
          this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.snackBar.open('Failed to create user: ' + error.message, 'Close', { duration: 5000 });
          this.isSaving = false;
        }
      });
    }
  }

  get availableRoles() {
    return this.roles;
  }
}

