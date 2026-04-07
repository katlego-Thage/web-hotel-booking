import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Booking, BookingStatus, UserRole } from '../../../models';
import { Auth, BookingService } from '../../../services';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-booking-list',
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
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './booking-list.html',
  styleUrl: './booking-list.css',
})

export class BookingListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['bookingID', 'room', 'tenant', 'dates', 'status', 'bookingDate', 'actions'];
  dataSource = new MatTableDataSource<Booking>([]);
  isLoading = true;
  bookings: Booking[] = [];
  statusFilter = '';
  isMyBookings = false;

  constructor(
    private bookingService: BookingService,
    private authService: Auth,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Check if this is the "my bookings" view
    this.isMyBookings = window.location.pathname.includes('/my');
    this.loadBookings();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.dataSource.data = bookings;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load bookings: ' + error.message, 'Close', { duration: 5000 });
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

  filterByStatus(): void {
    if (this.statusFilter) {
      this.dataSource.data = this.bookings.filter(b => b.status === this.statusFilter);
    } else {
      this.dataSource.data = this.bookings;
    }
  }

  getStatusClass(status?: string): string {
    return (status || '').toLowerCase().replace(' ', '');
  }

  updateStatus(booking: Booking, status: string): void {
    this.bookingService.updateStatus(booking.bookingID, { status: status as BookingStatus }).subscribe({
      next: () => {
        this.snackBar.open(`Booking status updated to ${status}`, 'Close', { duration: 3000 });
        this.loadBookings();
      },
      error: (error) => {
        this.snackBar.open('Failed to update status: ' + error.message, 'Close', { duration: 5000 });
      }
    });
  }

  canCancel(status?: string): boolean {
    return status === 'Pending' || status === 'Confirmed';
  }

  deleteBooking(booking: Booking): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Booking',
        message: `Are you sure you want to delete booking #${booking.bookingID}? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bookingService.deleteBooking(booking.bookingID).subscribe({
          next: () => {
            this.snackBar.open('Booking deleted successfully', 'Close', { duration: 3000 });
            this.loadBookings();
          },
          error: (error) => {
            this.snackBar.open('Failed to delete booking: ' + error.message, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  // Permission checks
  get canCreate(): boolean {
    return this.authService.hasAnyRole([UserRole.Admin, UserRole.Manager, UserRole.Receptionist, UserRole.Customer]);
  }

  get canEdit(): boolean {
    return this.authService.hasAnyRole([UserRole.Admin, UserRole.Manager, UserRole.Receptionist, UserRole.Customer]);
  }

  get canUpdateStatus(): boolean {
    return this.authService.hasAnyRole([UserRole.Admin, UserRole.Manager, UserRole.Receptionist]);
  }

  get canDelete(): boolean {
    return this.authService.hasAnyRole([UserRole.Admin, UserRole.Manager, UserRole.Customer]);
  }
}
