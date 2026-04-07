import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTenantRequest, Tenant, UpdateTenantRequest } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
   private readonly API_URL = 'https://localhost:7048/api';

  constructor(private http: HttpClient) { }

  getTenants(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(`${this.API_URL}/Tenant/GetTenant`); 
}
  getTenant(id: number): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.API_URL}/Tenant/GetTenant/${id}`);
  }

  createTenant(tenant: CreateTenantRequest): Observable<Tenant> {
    return this.http.post<Tenant>(`${this.API_URL}/Tenant/Tenant`, tenant);
  }

  updateTenant(id: number, tenant: UpdateTenantRequest): Observable<Tenant> {
    return this.http.put<Tenant>(`${this.API_URL}/Tenant/Tenant/${id}`, tenant);
  }

  deleteTenant(id: number): Observable<Tenant> {
    return this.http.delete<Tenant>(`${this.API_URL}/Tenant/Delete/${id}`);
  }

  searchTenants(query: string): Observable<Tenant[]> {
    // Note to self: This would require a search endpoint on the backend
    // For now, we'll filter on the client side
    return this.getTenants();
  }
}