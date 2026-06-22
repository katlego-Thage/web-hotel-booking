import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AvailableRoomsRequest, Booking, BookingDetails, CreateBookingRequest, Room, UpdateBookingRequest, UpdateStatusRequest } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingService {

  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  
  constructor(private http: HttpClient) { }

 get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getBookings(): Observable<Booking[]> {
    const token = this.token;
    if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
    return this.http.get<Booking[]>(`${this.API_URL}/Booking/GetBooking`, { headers });
  }

  getBooking(id: number): Observable<Booking> {
    const token = this.token;
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<Booking>(`${this.API_URL}/Booking/GetBooking/${id}`, { headers });
  }

  getBookingDetails(id: number): Observable<BookingDetails> {
    const token = this.token;
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<BookingDetails>(`${this.API_URL}/Booking/GetBookingDetails/${id}`, { headers });
  }

  getAvailableRooms(params: AvailableRoomsRequest): Observable<Room[]> {
    let httpParams = new HttpParams();
    
    if (params.checkIn) {
      httpParams = httpParams.set('checkIn', params.checkIn.toISOString());
    }
    if (params.checkOut) {
      httpParams = httpParams.set('checkOut', params.checkOut.toISOString());
    }
    if (params.roomType) {
      httpParams = httpParams.set('roomType', params.roomType.toString());
    }
    
    const token = this.token;
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<Room[]>(`${this.API_URL}/Booking/AvailableRooms`, { params: httpParams, headers });
  }

  createBooking(booking: CreateBookingRequest): Observable<Booking> {
    const token = this.token;
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<Booking>(`${this.API_URL}/Booking/CreateBooking`, booking, { headers }      );
  }

  updateBooking(id: number, booking: UpdateBookingRequest): Observable<Booking> {
    const token = this.token;
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put<Booking>(`${this.API_URL}/Booking/UpdateBooking/${id}`, booking, { headers });
  }

  updateStatus(id: number, status: UpdateStatusRequest): Observable<Booking> {
    const token = this.token;
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<Booking>(`${this.API_URL}/Booking/UpdateStatus/${id}`, JSON.stringify(status.status), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  deleteBooking(id: number): Observable<Booking> {
    return this.http.delete<Booking>(`${this.API_URL}/Booking/DeleteBooking/${id}`);
  }

  calculateTotalNights(checkIn: Date, checkOut: Date): number {
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  calculateTotalAmount(pricePerNight: number, nights: number): number {
    return pricePerNight * nights;
  }
}

