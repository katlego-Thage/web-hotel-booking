export interface Role {
  roleID: number;
  roleName: string;
}

export enum UserRole {
  Admin = 'Admin',
  Manager = 'Manager',
  Receptionist = 'Receptionist',
  Customer = 'Customer'
}

export const RolePermissions = {
  [UserRole.Admin]: [
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'bookings.view', 'bookings.create', 'bookings.edit', 'bookings.delete',
    'rooms.view', 'rooms.create', 'rooms.edit', 'rooms.delete',
    'tenants.view', 'tenants.create', 'tenants.edit', 'tenants.delete',
    'payments.view', 'payments.create', 'payments.edit', 'payments.delete'
  ],
  [UserRole.Manager]: [
    'users.view', 'users.create', 'users.edit',
    'bookings.view', 'bookings.create', 'bookings.edit', 'bookings.delete',
    'rooms.view', 'rooms.create', 'rooms.edit', 'rooms.delete',
    'tenants.view', 'tenants.create', 'tenants.edit', 'tenants.delete',
    'payments.view', 'payments.create', 'payments.edit'
  ],
  [UserRole.Receptionist]: [
    'users.view',
    'bookings.view', 'bookings.create', 'bookings.edit',
    'rooms.view',
    'tenants.view', 'tenants.create', 'tenants.edit',
    'payments.view', 'payments.create'
  ],
  [UserRole.Customer]: [
    'bookings.view', 'bookings.create', 'bookings.edit', 'bookings.delete',
    'rooms.view',
    'payments.view', 'payments.create', 'payments.edit'
  ]
};
