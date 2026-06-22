import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { LoginRequest, CreateUserRequest, User } from '../models';
import { RolePermissions, UserRole } from '../models/role.model'; // Import from your role file
import { environment } from '../../environments/environment';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    userId: number;
    username: string;
    email: string;
    roleName: string;
    createdAt?: Date;
  };
}

interface JwtPayloadWithClaims extends JwtPayload {
  [CLAIMS.NAME]?: string;
  [CLAIMS.EMAIL]?: string;
  [CLAIMS.ROLE]?: string;
  sub?: string;
}

const CLAIMS = {
  NAME: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  EMAIL: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
  ROLE: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
} as const;

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = this.getStoredUser();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // ========== AUTH API ==========
  login(credentials: LoginRequest): Observable<string> {
    return this.http.post<AuthResponse>(`${this.API_URL}/User/UserLogIn`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response.accessToken)),
      map(response => response.accessToken),
      catchError(this.handleError)
    );
  }

  register(userData: CreateUserRequest): Observable<string> {
    return this.http.post<AuthResponse>(`${this.API_URL}/User/CreateUser`, userData).pipe(
      tap(response => this.handleAuthSuccess(response.accessToken)),
      map(response => response.accessToken),
      catchError(this.handleError)
    );
  }

  refreshUserInfo(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/User/GetUser`).pipe(
      tap(user => this.updateUser(user)),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  // ========== ROLE CHECKS (JWT-driven, enum for type safety) ==========
  
  /** Check if user has a specific role — role comes from JWT, enum is just for IDE autocomplete */
  hasRole(role: UserRole | string): boolean {
    const userRole = this.currentUser?.roleName;
    if (!userRole) return false;
    return userRole === role;
  }

  /** Check if user has any of the required roles */
  hasAnyRole(roles: (UserRole | string)[]): boolean {
    const userRole = this.currentUser?.roleName;
    if (!userRole) return false;
    return roles.some(role => userRole === role);
  }

  /** Check permission — uses hardcoded RolePermissions map */
  hasPermission(permission: string): boolean {
    const userRole = this.currentUser?.roleName as UserRole;
    if (!userRole) return false;
    
    const permissions = RolePermissions[userRole] || [];
    return permissions.includes(permission);
  }

  // ========== TOKEN HANDLING ==========
  private handleAuthSuccess(token: string): void {
    this.setToken(token);
    const user = this.decodeToken(token);
    this.updateUser(user);
    this.isAuthenticatedSubject.next(true);
  }

  private decodeToken(token: string): User {
    const decoded = jwtDecode<JwtPayloadWithClaims>(token);
    return {
      userID: decoded.sub ? parseInt(decoded.sub) : 0,
      username: decoded[CLAIMS.NAME] ?? '',
      email: decoded[CLAIMS.EMAIL] ?? '',
      roleName: decoded[CLAIMS.ROLE] ?? ''
    };
  }

  private hasValidToken(): boolean {
    const token = this.token;
    if (!token) return false;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (typeof decoded.exp !== 'number') return false;
      return decoded.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  private updateUser(user: User): void {
    this.setUser(user);
    this.currentUserSubject.next(user);
  }

  private handleError(error: any) {
    return throwError(() => error);
  }
}