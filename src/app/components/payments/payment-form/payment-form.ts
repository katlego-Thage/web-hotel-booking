import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Payment, Booking, PaymentMethods } from '../../../models';
import { PaymentService, BookingService } from '../../../services';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
@Component({
  selector: 'app-payment-form',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.css',
})

export class PaymentFormComponent implements OnInit {
  payment: Partial<Payment> = {
    bookingID: undefined,
    amount: undefined,
    paymentMethod: '',
    paymentDate: new Date()
  };
  
  bookings: Booking[] = [];
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  paymentId: number | null = null;
  paymentMethods = PaymentMethods;

  constructor(
    private paymentService: PaymentService,
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.paymentId = this.route.snapshot.params['id'];
    if (this.paymentId) {
      this.isEditMode = true;
      this.loadPayment(this.paymentId);
    }
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
      },
      error: () => {
        this.snackBar.open('Failed to load bookings', 'Close', { duration: 5000 });
      }
    });
  }

  loadPayment(id: number): void {
    this.isLoading = true;
    this.paymentService.getPayment(id).subscribe({
      next: (payment) => {
        this.payment = {
          paymentID: payment.paymentID,
          bookingID: payment.bookingID,
          amount: payment.amount,
          paymentMethod: payment.paymentMethod,
          paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : new Date()
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load payment: ' + error.message, 'Close', { duration: 5000 });
        this.isLoading = false;
        this.router.navigate(['/payments']);
      }
    });
  }

  onSubmit(): void {
    if (!this.payment.bookingID || !this.payment.amount || !this.payment.paymentMethod) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    if (this.payment.amount <= 0) {
      this.snackBar.open('Amount must be greater than zero', 'Close', { duration: 3000 });
      return;
    }

    this.isSaving = true;

    if (this.isEditMode && this.paymentId) {
      const updateData = {
        paymentID: this.paymentId,
        bookingID: this.payment.bookingID!,
        amount: this.payment.amount!,
        paymentMethod: this.payment.paymentMethod!,
        paymentDate: this.payment.paymentDate
      };

      this.paymentService.updatePayment(this.paymentId, updateData).subscribe({
        next: () => {
          this.snackBar.open('Payment updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/payments']);
        },
        error: (error) => {
          this.snackBar.open('Failed to update payment: ' + error.message, 'Close', { duration: 5000 });
          this.isSaving = false;
        }
      });
    } else {
      const createData = {
        bookingID: this.payment.bookingID!,
        amount: this.payment.amount!,
        paymentMethod: this.payment.paymentMethod!,
        paymentDate: this.payment.paymentDate
      };

      this.paymentService.createPayment(createData).subscribe({
        next: () => {
          this.snackBar.open('Payment recorded successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/payments']);
        },
        error: (error) => {
          this.snackBar.open('Failed to record payment: ' + error.message, 'Close', { duration: 5000 });
          this.isSaving = false;
        }
      });
    }
  }
}

