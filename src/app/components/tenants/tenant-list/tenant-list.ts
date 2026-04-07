import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Tenant, UserRole } from '../../../models';
import { Auth, TenantService } from '../../../services';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './tenant-list.html',
  styleUrl: './tenant-list.css',
})

export class TenantListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['name', 'email', 'phone', 'address', 'actions'];
  dataSource = new MatTableDataSource<Tenant>([]);
  isLoading = true;
  tenants: Tenant[] = [];

  constructor(
    private tenantService: TenantService,
    private authService: Auth,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTenants();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTenants(): void {
    this.isLoading = true;
    this.tenantService.getTenants().subscribe({
      next: (tenants) => {
        this.tenants = tenants;
        this.dataSource.data = tenants;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load guests: ' + error.message, 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  deleteTenant(tenant: Tenant): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Guest',
        message: `Are you sure you want to delete "${tenant.fullName}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tenantService.deleteTenant(tenant.tenantID).subscribe({
          next: () => {
            this.snackBar.open('Guest deleted successfully', 'Close', { duration: 3000 });
            this.loadTenants();
          },
          error: (error) => {
            this.snackBar.open('Failed to delete guest: ' + error.message, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  // Permission checks
  get canCreate(): boolean {
    return this.authService.hasAnyRole([UserRole.Admin, UserRole.Manager, UserRole.Receptionist]);
  }

  get canEdit(): boolean {
    return this.authService.hasAnyRole([UserRole.Admin, UserRole.Manager, UserRole.Receptionist]);
  }

  get canDelete(): boolean {
    return this.authService.hasAnyRole([UserRole.Admin, UserRole.Manager]);
  }
}
