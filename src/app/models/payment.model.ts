export interface Payment {
  paymentID: number;
  bookingID: number;
  amount?: number;
  paymentDate?: Date;
  paymentMethod?: string;
  
  // Extended properties for display
  tenantName?: string;
  roomNumber?: string;
}

export interface CreatePaymentRequest {
  bookingID: number;
  amount: number;
  paymentDate?: Date;
  paymentMethod: string;
}

export interface UpdatePaymentRequest {
  paymentID: number;
  bookingID: number;
  amount: number;
  paymentDate?: Date;
  paymentMethod: string;
}

export const PaymentMethods = [
  { value: 'Cash', label: 'Cash', icon: 'payments' },
  { value: 'Credit Card', label: 'Credit Card', icon: 'credit_card' },
  { value: 'Debit Card', label: 'Debit Card', icon: 'credit_card' },
  { value: 'Bank Transfer', label: 'Bank Transfer', icon: 'account_balance' },
  { value: 'Mobile Payment', label: 'Mobile Payment', icon: 'phone_iphone' }
];
