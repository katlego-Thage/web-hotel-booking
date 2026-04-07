export interface Tenant {
  tenantID: number;
  fullName: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface CreateTenantRequest {
  fullName: string;
  phone: string;
  email: string;
  address: string;
}

export interface UpdateTenantRequest {
  tenantID: number;
  fullName: string;
  phone: string;
  email: string;
  address: string;
}
