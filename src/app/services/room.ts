import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateRoomRequest, Room, UpdateRoomRequest } from '../models';

@Injectable({
  providedIn: 'root',
})
export class RoomService {

    private readonly API_URL = 'https://localhost:7048/api';

  constructor(private http: HttpClient) { }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.API_URL}/Room/GetRoom`);
}
  getRoom(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.API_URL}/Room/GetRoom/${id}`);
  }

  createRoom(room: CreateRoomRequest): Observable<Room> {
    return this.http.post<Room>(`${this.API_URL}/Room/Rom`, room);
  }

  updateRoom(id: number, room: UpdateRoomRequest): Observable<Room> {
    return this.http.put<Room>(`${this.API_URL}/Room/Tenant/${id}`, room);
  }

  deleteRoom(id: number): Observable<Room> {
    return this.http.delete<Room>(`${this.API_URL}/Room/Delete/${id}`);
  }

  getAvailableRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.API_URL}/Room/GetRoom`);
  }
}