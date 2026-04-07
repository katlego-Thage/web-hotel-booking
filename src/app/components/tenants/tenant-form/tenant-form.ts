import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Tenant } from '../../../models';
import { TenantService } from '../../../services';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
@Component({
  selector: 'app-tenant-form',
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
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './tenant-form.html',
  styleUrl: './tenant-form.css',
})

export class TenantFormComponent implements OnInit {
  tenant: Partial<Tenant> = {
    fullName: '',
    email: '',
    phone: '',
    address: ''
  };
  
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  tenantId: number | null = null;

  constructor(
    private tenantService: TenantService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.tenantId = this.route.snapshot.params['id'];
    if (this.tenantId) {
      this.isEditMode = true;
      this.loadTenant(this.tenantId);
    }
  }

  loadTenant(id: number): void {
    this.isLoading = true;
    this.tenantService.getTenant(id).subscribe({
      next: (tenant) => {
        this.tenant = {
          tenantID: tenant.tenantID,
          fullName: tenant.fullName,
          email: tenant.email,
          phone: tenant.phone,
          address: tenant.address
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load guest: ' + error.message, 'Close', { duration: 5000 });
        this.isLoading = false;
        this.router.navigate(['/tenants']);
      }
    });
  }

  onSubmit(): void {
    if (!this.tenant.fullName || !this.tenant.email || !this.tenant.phone || !this.tenant.address) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.tenant.email)) {
      this.snackBar.open('Please enter a valid email address', 'Close', { duration: 3000 });
      return;
    }

    this.isSaving = true;

    if (this.isEditMode && this.tenantId) {
      const updateData = {
        tenantID: this.tenantId,
        fullName: this.tenant.fullName!,
        email: this.tenant.email!,
        phone: this.tenant.phone!,
        address: this.tenant.address!
      };

      this.tenantService.updateTenant(this.tenantId, updateData).subscribe({
        next: () => {
          this.snackBar.open('Guest updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/tenants']);
        },
        error: (error) => {
          this.snackBar.open('Failed to update guest: ' + error.message, 'Close', { duration: 5000 });
          this.isSaving = false;
        }
      });
    } else {
      const createData = {
        fullName: this.tenant.fullName!,
        email: this.tenant.email!,
        phone: this.tenant.phone!,
        address: this.tenant.address!
      };

      this.tenantService.createTenant(createData).subscribe({
        next: () => {
          this.snackBar.open('Guest added successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/tenants']);
        },
        error: (error) => {
          this.snackBar.open('Failed to add guest: ' + error.message, 'Close', { duration: 5000 });
          this.isSaving = false;
        }
      });
    }
  }
}

