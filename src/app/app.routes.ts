import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { UserRole } from './models';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  
    {
    path: 'login',
    loadComponent: () => import('./components/logincomponent/login/login.component').then(m => m.LoginComponent)
  },
  // Protected Routes with Dashboard Layout
  {
    path: '',
    loadComponent: () => import('./components/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    children: [
      // Dashboard Home
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/home/home').then(m => m.HomeComponent)
      },
      
      // User Management Routes
      {
        path: 'users',
        loadComponent: () => import('./components/users/user-list/user-list').then(m => m.UserListComponent),
        data: { roles: [UserRole.Admin, UserRole.Manager, UserRole.Receptionist] }
      },
      {
        path: 'users/new',
        loadComponent: () => import('./components/users/user-form/user-form').then(m => m.UserFormComponent),
        data: { roles: [UserRole.Admin, UserRole.Customer] }
      },
      {
        path: 'users/edit/:id',
        loadComponent: () => import('./components/users/user-form/user-form').then(m => m.UserFormComponent),
        data: { roles: [UserRole.Admin, UserRole.Customer] }
      },
      
      // Booking Management Routes
      {
        path: 'bookings',
        loadComponent: () => import('./components/bookings/booking-list/booking-list').then(m => m.BookingListComponent),
        data: { roles: [UserRole.Admin, UserRole.Manager, UserRole.Receptionist, UserRole.Customer] }
      },
      {
        path: 'bookings/my',
        loadComponent: () => import('./components/bookings/booking-list/booking-list').then(m => m.BookingListComponent),
        data: { roles: [UserRole.Customer] }
      },
      {
        path: 'bookings/new',
        loadComponent: () => import('./components/bookings/booking-form/booking-form').then(m => m.BookingFormComponent),
        data: { roles: [UserRole.Admin, UserRole.Manager, UserRole.Receptionist, UserRole.Customer] }
      },
      {
        path: 'bookings/edit/:id',
        loadComponent: () => import('./components/bookings/booking-form/booking-form').then(m => m.BookingFormComponent),
        data: { roles: [UserRole.Admin, UserRole.Manager, UserRole.Receptionist, UserRole.Customer] }
      },
      
      // Room Management Routes
      {
        path: 'rooms',
        loadComponent: () => import('./components/rooms/room-list/room-list').then(m => m.RoomListComponent),
        data: { roles: [UserRole.Admin, UserRole.Manager, UserRole.Receptionist, UserRole.Customer] }
      },
      {
        path: 'rooms/new',
        loadComponent: () => import('./components/rooms/room-form/room-form').then(m => m.RoomFormComponent),
        data: { roles: [UserRole.Admin, UserRole.Manager] }
      },
      {
        path: 'rooms/edit/:id',
        loadComponent: () => import('./components/rooms/room-form/room-form').then(m => m.RoomFormComponent),
        data: { roles: [UserRole.Admin, UserRole.Manager] }
      },
      
      // Tenant Management Routes
      {
        path: 'tenants',
        loadComponent: () => import('./components/tenants/tenant-list/tenant-list').then(m => m.TenantListComponent),
        data: { roles: [UserRole.Admin, UserRole.Manager, UserRole.Receptionist] }
      },
      {
        path: 'tenants/new',
        loadComponent: () => import('./components/tenants/tenant-form/tenant-form').then(m => m.TenantFormComponent),
        data: { roles: [UserRole.Admin, UserRole.Manager, UserRole.Receptionist] }
      },
      {
        path: 'tenants/edit/:id',
        loadComponent: () => import('./components/tenants/tenant-form/tenant-form').then(m => m.TenantFormComponent),
        data: { roles: [UserRole.Admin, UserRole.Manager, UserRole.Receptionist] }
      },
      
      // Payment Management Routes
      {
        path: 'payments',
        loadComponent: () => import('./components/payments/payment-list/payment-list').then(m => m.PaymentListComponent),
        data: { roles: [UserRole.Admin, UserRole.Manager, UserRole.Receptionist, UserRole.Customer] }
      },
      {
        path: 'payments/new',
        loadComponent: () => import('./components/payments/payment-form/payment-form').then(m => m.PaymentFormComponent),
        data: { roles: [UserRole.Admin, UserRole.Manager, UserRole.Receptionist, UserRole.Customer] }
      },
      {
        path: 'payments/edit/:id',
        loadComponent: () => import('./components/payments/payment-form/payment-form').then(m => m.PaymentFormComponent),
        data: { roles: [UserRole.Admin, UserRole.Manager, UserRole.Receptionist, UserRole.Customer] }
      }
    ]
  },
  
  // Unauthorized Page
  {
    path: 'unauthorized',
    loadComponent: () => import('./components/shared/unauthorized/unauthorized').then(m => m.UnauthorizedComponent)
  },
  
  // Redirect to login for unknown routes
  {
    path: '**',
    redirectTo: 'login'
  }
];