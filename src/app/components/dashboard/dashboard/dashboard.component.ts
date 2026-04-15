import { Component, OnDestroy, OnInit } from '@angular/core';
import { User, UserRole } from '../../../models';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Subscription, Observable, map, shareReplay } from 'rxjs';
import { Auth } from '../../../services';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: UserRole[];
  badge?: number;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatSnackBarModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private userSubscription: Subscription | null = null;

  isHandset$!: Observable<boolean>; 

  // Navigation items grouped by category
  allNavItems: NavItem[] = [
    // Main Menu
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', roles: [UserRole.Admin, UserRole.Manager, UserRole.Receptionist, UserRole.Customer] },
    { label: 'My Bookings', icon: 'event_note', route: '/bookings/mybookings', roles: [UserRole.Customer] },
    
    // Management
    { label: 'All Bookings', icon: 'calendar_today', route: '/bookings', roles: [UserRole.Admin, UserRole.Manager, UserRole.Receptionist] },
    { label: 'Rooms', icon: 'king_bed', route: '/rooms', roles: [UserRole.Admin, UserRole.Manager, UserRole.Receptionist, UserRole.Customer] },
    { label: 'Tenants', icon: 'people', route: '/tenants', roles: [UserRole.Admin, UserRole.Manager, UserRole.Receptionist] },
    { label: 'Payments', icon: 'payment', route: '/payments', roles: [UserRole.Admin, UserRole.Manager, UserRole.Receptionist, UserRole.Customer] },
    
    // Administration
    { label: 'Users', icon: 'manage_accounts', route: '/users', roles: [UserRole.Admin, UserRole.Manager, UserRole.Receptionist] },
  ];

  constructor(
    private authService: Auth,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
      this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  get mainNavItems(): NavItem[] {
    return this.allNavItems.filter(item => 
      ['Dashboard', 'My Bookings'].includes(item.label) && 
      this.hasAccess(item.roles)
    );
  }

  get managementNavItems(): NavItem[] {
    return this.allNavItems.filter(item => 
      ['All Bookings', 'Rooms', 'Tenants', 'Payments'].includes(item.label) && 
      this.hasAccess(item.roles)
    );
  }

  get adminNavItems(): NavItem[] {
    return this.allNavItems.filter(item => 
      item.label === 'Users' && 
      this.hasAccess(item.roles)
    );
  }

  private hasAccess(roles: UserRole[]): boolean {
    return roles.some(role => this.authService.hasRole(role));
  }

  logout(): void {
    this.authService.logout();
    this.snackBar.open('Logged out successfully', 'Close', { duration: 3000 });
    this.router.navigate(['/login']);
  }
}

