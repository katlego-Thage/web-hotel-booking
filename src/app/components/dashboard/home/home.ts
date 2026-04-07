import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { Booking, Room, Payment, BookingStatus, UserRole } from '../../../models';
import { BookingService, RoomService, TenantService, PaymentService, Auth } from '../../../services';
interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  availableRooms: number;
  totalTenants: number;
  totalRevenue: number;
  pendingPayments: number;
}
@Component({
  selector: 'app-home',
    imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatListModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class HomeComponent implements OnInit {
  currentUser: any; // or User | null
  isLoading = true;
  
  stats: DashboardStats = {
    totalBookings: 0,
    activeBookings: 0,
    availableRooms: 0,
    totalTenants: 0,
    totalRevenue: 0,
    pendingPayments: 0
  };
  
  recentBookings: Booking[] = [];
  rooms: Room[] = [];
  bookings: Booking[] = [];
  payments: Payment[] = [];

  constructor(
    private authService: Auth,
    private bookingService: BookingService,
    private roomService: RoomService,
    private tenantService: TenantService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Load all necessary data
    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.stats.availableRooms = rooms.filter(r => r.isAvailable).length;
      },
      error: () => this.showError('Failed to load rooms')
    });

    this.bookingService.getBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.stats.totalBookings = bookings.length;
        this.stats.activeBookings = bookings.filter(b => 
          b.status === BookingStatus.Confirmed || b.status === BookingStatus.CheckedIn
        ).length;
        this.recentBookings = bookings
          .sort((a, b) => new Date(b.bookingDate || 0).getTime() - new Date(a.bookingDate || 0).getTime())
          .slice(0, 5);
        this.isLoading = false;
      },
      error: () => {
        this.showError('Failed to load bookings');
        this.isLoading = false;
      }
    });

    if (this.canViewFinancials) {
      this.paymentService.getPayments().subscribe({
        next: (payments) => {
          this.payments = payments;
          this.stats.totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        },
        error: () => this.showError('Failed to load payments')
      });
    }
  }

  getStatusIcon(status?: string): string {
    switch (status) {
      case 'Pending': return 'schedule';
      case 'Confirmed': return 'check_circle';
      case 'CheckedIn': return 'login';
      case 'CheckedOut': return 'logout';
      case 'Cancelled': return 'cancel';
      default: return 'help';
    }
  }

  // Permission checks
  get canViewFinancials(): boolean {
    return this.authService.hasAnyRole([UserRole.Admin, UserRole.Manager, UserRole.Receptionist]);
  }

  get canViewRooms(): boolean {
    return this.authService.hasAnyRole([UserRole.Admin, UserRole.Manager, UserRole.Receptionist]);
  }

  get canCreateBooking(): boolean {
    return this.authService.hasAnyRole([UserRole.Admin, UserRole.Manager, UserRole.Receptionist, UserRole.Customer]);
  }

  get canManageRooms(): boolean {
    return this.authService.hasAnyRole([UserRole.Admin, UserRole.Manager]);
  }

  get canManageTenants(): boolean {
    return this.authService.hasAnyRole([UserRole.Admin, UserRole.Manager, UserRole.Receptionist]);
  }

  get canCreatePayment(): boolean {
    return this.authService.hasAnyRole([UserRole.Admin, UserRole.Manager, UserRole.Receptionist, UserRole.Customer]);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }
}

