import { Injectable } from '@angular/core';
import { CreatePaymentRequest, Payment, UpdatePaymentRequest } from '../models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
    private readonly API_URL = 'https://localhost:7048/api';

  constructor(private http: HttpClient) { }

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.API_URL}/Payment/GetPayment`);
}
  getPayment(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.API_URL}/Payment/GetPayment/${id}`);
  }

  createPayment(payment: CreatePaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(`${this.API_URL}/Payment/Payment`, payment);
  }

  updatePayment(id: number, payment: UpdatePaymentRequest): Observable<Payment> {
    return this.http.put<Payment>(`${this.API_URL}/Payment/Payment/${id}`, payment);
  }

  deletePayment(id: number): Observable<Payment> {
    return this.http.delete<Payment>(`${this.API_URL}/Payment/Delete/${id}`);
  }

  getPaymentsByBooking(bookingId: number): Observable<Payment[]> {
    // Note to self: This would require a specific endpoint on the backend
    // For now, we filter on the client side
    return this.getPayments();
  }
}