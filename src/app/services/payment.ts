import { Injectable } from '@angular/core';
import { CreatePaymentRequest, Payment, UpdatePaymentRequest } from '../models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
    private readonly API_URL = environment.apiUrl;

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
    return this.getPayments();
  }
}