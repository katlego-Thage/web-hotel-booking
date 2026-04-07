import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CreateUserRequest, UpdateUserRequest, User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
    private readonly API_URL = 'https://localhost:7048/api';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/User/GetUser`);
}
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/User/GetUser/${id}`);
  }

  createUser(user: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/User/CreateUser`, user);
  }

  updateUser(id: number, user: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/User/UpdateUser/${id}`, user);
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${this.API_URL}/User/RemoveUser/${id}`);
  }
}