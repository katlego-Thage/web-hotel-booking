export interface Room {
  roomID: number;
  roomNumber: string;
  roomType: string;
  pricePerNight?: number;
  isAvailable?: boolean;
}

export interface CreateRoomRequest {
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  isAvailable?: boolean;
}

export interface UpdateRoomRequest {
  roomID: number;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  isAvailable: boolean;
}

export const RoomTypes = [
  { value: 'Single', label: 'Single Room', description: 'Perfect for solo travelers' },
  { value: 'Double', label: 'Double Room', description: 'Comfortable for two guests' },
  { value: 'Twin', label: 'Twin Room', description: 'Two single beds' },
  { value: 'Suite', label: 'Suite', description: 'Luxury accommodation with living area' },
  { value: 'Deluxe', label: 'Deluxe Room', description: 'Premium amenities and space' },
  { value: 'Family', label: 'Family Room', description: 'Spacious room for families' }
];

