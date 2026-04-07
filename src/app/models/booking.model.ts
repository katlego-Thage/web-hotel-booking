export interface Booking {
  bookingID: number;
  tenantID: number;
  roomID: number;
  bookingDate?: Date;
  checkInDate?: Date;
  checkOutDate?: Date;
  status?: BookingStatus;
  userId?: number;
  
  // Extended properties for display
  tenantName?: string;
  roomNumber?: string;
  roomType?: string;
  totalAmount?: number;
}

export enum BookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  CheckedIn = 'CheckedIn',
  CheckedOut = 'CheckedOut',
  Cancelled = 'Cancelled'
}

export interface BookingDetails {
  bookingID: number;
  tenantID: number;
  roomID: number;
  bookingDate: Date;
  checkInDate: Date;
  checkOutDate: Date;
  status: string;
  userId: number;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  totalNights: number;
  totalAmount: number;
}

export interface CreateBookingRequest {
  tenantID: number;
  roomID: number;
  checkInDate: Date;
  checkOutDate: Date;
  userId?: number;
}

export interface UpdateBookingRequest {
  bookingID: number;
  tenantID: number;
  roomID: number;
  checkInDate?: Date;
  checkOutDate?: Date;
  status?: string;
  userId?: number;
}

export interface UpdateStatusRequest {
  status: BookingStatus;
}

export interface AvailableRoomsRequest {
  checkIn?: Date;
  checkOut?: Date;
  roomType?: number;
}
