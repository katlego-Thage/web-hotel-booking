import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule, MatCard, MatCardContent } from '@angular/material/card';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatDatepickerModule, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatDividerModule, MatDivider } from '@angular/material/divider';
import { MatFormFieldModule, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule, MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule, MatSelect } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule, MatStepper, MatStep } from '@angular/material/stepper';
import { Booking, Room, Tenant, UpdateBookingRequest, BookingStatus, CreateBookingRequest } from '../../../models';
import { Auth, BookingService, RoomService, TenantService } from '../../../services';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [MatIcon, 
    MatProgressSpinner, 
    MatCard, 
    MatCardContent, 
    MatStepper, 
    MatStep, 
    MatFormField, 
    MatLabel, 
    MatDatepickerToggle, 
    MatDatepicker,
    MatSelect, 
    MatOption, 
    MatDivider,    
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatStepperModule,
    MatDividerModule],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.css',
})
export class BookingFormComponent implements OnInit {
    booking: Partial<Booking> = {
    checkInDate: undefined,
    checkOutDate: undefined,
    roomID: undefined,
    tenantID: undefined,
    status: BookingStatus.Pending
  };
  
  availableRooms: Room[] = [];
  tenants: Tenant[] = [];
  selectedRoom: Room | null = null;
  selectedTenant: Tenant | null = null;
  
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  bookingId: number | null = null;
  
  minDate = new Date();
  nights = 0;
  totalAmount = 0;

  constructor(
    private bookingService: BookingService,
    private roomService: RoomService,
    private tenantService: TenantService,
    private authService: Auth,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.bookingId = this.route.snapshot.params['id'];
    if (this.bookingId) {
      this.isEditMode = true;
      this.loadBooking(this.bookingId);
    } else {
      this.loadInitialData();
    }
  }

  loadInitialData(): void {
    this.isLoading = true;
    
    // Load tenants
    this.tenantService.getTenants().subscribe({
      next: (tenants) => {
        this.tenants = tenants;
      },
      error: () => {
        this.snackBar.open('Failed to load tenants', 'Close', { duration: 5000 });
      }
    });

    // Load available rooms
    this.loadAvailableRooms();
    this.isLoading = false;
  }

  loadBooking(id: number): void {
    this.isLoading = true;
    this.bookingService.getBooking(id).subscribe({
      next: (booking) => {
        this.booking = {
          bookingID: booking.bookingID,
          tenantID: booking.tenantID,
          roomID: booking.roomID,
          checkInDate: booking.checkInDate ? new Date(booking.checkInDate) : undefined,
          checkOutDate: booking.checkOutDate ? new Date(booking.checkOutDate) : undefined,
          status: booking.status
        };
        this.calculateNights();
        this.loadInitialData();
      },
      error: () => {
        this.snackBar.open('Failed to load booking', 'Close', { duration: 5000 });
        this.router.navigate(['/bookings']);
      }
    });
  }

  loadAvailableRooms(): void {
    if (this.booking.checkInDate && this.booking.checkOutDate) {
      this.bookingService.getAvailableRooms({
        checkIn: this.booking.checkInDate,
        checkOut: this.booking.checkOutDate
      }).subscribe({
        next: (rooms) => {
          this.availableRooms = rooms;
        },
        error: () => {
          this.snackBar.open('Failed to load available rooms', 'Close', { duration: 5000 });
        }
      });
    } else {
      // Load all rooms if no dates selected
      this.roomService.getRooms().subscribe({
        next: (rooms) => {
          this.availableRooms = rooms.filter(r => r.isAvailable);
        },
        error: () => {
          this.snackBar.open('Failed to load rooms', 'Close', { duration: 5000 });
        }
      });
    }
  }

  onDateChange(): void {
    this.calculateNights();
    this.loadAvailableRooms();
    this.selectedRoom = null;
    this.booking.roomID = undefined;
  }

  calculateNights(): void {
    if (this.booking.checkInDate && this.booking.checkOutDate) {
      this.nights = this.bookingService.calculateTotalNights(
        new Date(this.booking.checkInDate),
        new Date(this.booking.checkOutDate)
      );
      this.calculateTotal();
    }
  }

  selectRoom(room: Room): void {
    this.booking.roomID = room.roomID;
    this.selectedRoom = room;
    this.calculateTotal();
  }

  calculateTotal(): void {
    if (this.selectedRoom && this.selectedRoom.pricePerNight && this.nights > 0) {
      this.totalAmount = this.bookingService.calculateTotalAmount(
        this.selectedRoom.pricePerNight,
        this.nights
      );
    }
  }

  isStep1Valid(): boolean {
    return !!this.booking.checkInDate && !!this.booking.checkOutDate && this.nights > 0;
  }

  isStep2Valid(): boolean {
    return !!this.booking.roomID;
  }

  isStep3Valid(): boolean {
    return !!this.booking.tenantID;
  }

  onSubmit(): void {
    if (!this.isStep1Valid() || !this.isStep2Valid() || !this.isStep3Valid()) {
      this.snackBar.open('Please complete all steps', 'Close', { duration: 3000 });
      return;
    }

    this.isSaving = true;

    if (this.isEditMode && this.bookingId) {
      const updateData: UpdateBookingRequest = {
        bookingID: this.bookingId,
        tenantID: this.booking.tenantID!,
        roomID: this.booking.roomID!,
        checkInDate: this.booking.checkInDate,
        checkOutDate: this.booking.checkOutDate,
        status: this.booking.status as BookingStatus
      };

      this.bookingService.updateBooking(this.bookingId, updateData).subscribe({
        next: () => {
          this.snackBar.open('Booking updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/bookings']);
        },
        error: (error) => {
          this.snackBar.open('Failed to update booking: ' + error.message, 'Close', { duration: 5000 });
          this.isSaving = false;
        }
      });
    } else {
      const createData: CreateBookingRequest = {
        tenantID: this.booking.tenantID!,
        roomID: this.booking.roomID!,
        checkInDate: this.booking.checkInDate!,
        checkOutDate: this.booking.checkOutDate!,
        userId: this.authService.currentUser?.userID
      };

      this.bookingService.createBooking(createData).subscribe({
        next: () => {
          this.snackBar.open('Booking created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/bookings']);
        },
        error: (error) => {
          this.snackBar.open('Failed to create booking: ' + error.message, 'Close', { duration: 5000 });
          this.isSaving = false;
        }
      });
    }
  }
}

