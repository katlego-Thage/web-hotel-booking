// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
// import { LoginRequest, User, UserRole } from '../models';
// import { jwtDecode, JwtPayload } from 'jwt-decode';

// interface JwtPayloadWithClaims extends JwtPayload {
//   'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
//   'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
//   'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
// }
// @Injectable({
//   providedIn: 'root',
// })
// export class Auth {

//    private readonly API_URL = 'https://localhost:7048/api';
//   private readonly TOKEN_KEY = 'auth_token';
//   private readonly USER_KEY = 'auth_user';
  
//     private currentUserSubject: BehaviorSubject<User | null>;
//   public currentUser$: Observable<User | null>;
  
//   private isAuthenticatedSubject: BehaviorSubject<boolean>;
//   public isAuthenticated$: Observable<boolean>;

//   constructor(private http: HttpClient) {
//     const storedUser = this.getStoredUser();
//     this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
//     this.currentUser$ = this.currentUserSubject.asObservable();
    
//     this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
//     this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
// }

// public get currentUser(): User | null {
//     return this.currentUserSubject.value;
//   }

//   public get isAuthenticated(): boolean {
//     return this.isAuthenticatedSubject.value;
//   }

//   public get token(): string | null {
//     return localStorage.getItem(this.TOKEN_KEY);
//   }

//   login(credentials: LoginRequest): Observable<string> {
//     return this.http.post(`${this.API_URL}/User/UserLogIn`, credentials, { responseType: 'text' })
//       .pipe(
//         tap(token => {
//           this.setToken(token);
//           const user = this.decodeToken(token);
//           this.setUser(user);
//           this.currentUserSubject.next(user);
//           this.isAuthenticatedSubject.next(true);
//         }),
//         catchError(error => {
//           return throwError(() => error);
//         })
//       );
//   }

//   register(userData: { username: string; email: string; password: string; roleID?: number }): Observable<string> {
//     const request = {
//       username: userData.username,
//       email: userData.email,
//       passwordHash: userData.password,
//       roleID: userData.roleID || 4, // Default to Customer role
//       createdAt: new Date()
//     };
    
//     return this.http.post(`${this.API_URL}/User/CreateUser`, request, { responseType: 'text' })
//       .pipe(
//         tap(token => {
//           this.setToken(token);
//           const user = this.decodeToken(token);
//           this.setUser(user);
//           this.currentUserSubject.next(user);
//           this.isAuthenticatedSubject.next(true);
//         }),
//         catchError(error => {
//           return throwError(() => error);
//         })
//       );
//   }

//   logout(): void {
//     localStorage.removeItem(this.TOKEN_KEY);
//     localStorage.removeItem(this.USER_KEY);
//     this.currentUserSubject.next(null);
//     this.isAuthenticatedSubject.next(false);
//   }

//   hasRole(role: UserRole | UserRole[]): boolean {
//     const user = this.currentUser;
//     if (!user || !user.roleName) return false;
    
//     if (Array.isArray(role)) {
//       return role.includes(user.roleName as UserRole);
//     }
//     return user.roleName === role;
//   }

//   hasAnyRole(roles: UserRole[]): boolean {
//     return roles.some(role => this.hasRole(role));
//   }

//   hasPermission(permission: string): boolean {
//     const user = this.currentUser;
//     if (!user || !user.roleName) return false;
    
//     // Import RolePermissions dynamically to avoid circular dependency
//     const { RolePermissions } = require('../models/role.model');
//     const permissions = RolePermissions[user.roleName as UserRole] || [];
//     return permissions.includes(permission);
//   }

//   private setToken(token: string): void {
//     localStorage.setItem(this.TOKEN_KEY, token);
//   }

//   private setUser(user: User): void {
//     localStorage.setItem(this.USER_KEY, JSON.stringify(user));
//   }

//   private getStoredUser(): User | null {
//     const userJson = localStorage.getItem(this.USER_KEY);
//     return userJson ? JSON.parse(userJson) : null;
//   }

//   // private hasValidToken(): boolean {
//   //   const token = this.token;
//   //   if (!token) return false;
    
//   //   try {
//   //     const decoded = jwtDecode<JwtPayload>(token);
//   //     const currentTime = Math.floor(Date.now() / 1000);
//   //     return decoded.exp > currentTime;
//   //   } catch {
//   //     return false;
//   //   }
//   // }
  
// private hasValidToken(): boolean {
//   const token = this.token;
//   if (!token) return false;

//   try {
//     const decoded = jwtDecode<JwtPayloadWithClaims>(token);
//     // const decoded = jwtDecode<JwtPayload>(token);
//     const currentTime = Math.floor(Date.now() / 1000);

//     if (!decoded.exp) return false;

//     return decoded.exp > currentTime;
//   } catch {
//     return false;
//   }
// }

//   // private decodeToken(token: string): User {
//     // const decoded = jwtDecode<JwtPayload>(token);
    
//     // return {
//     //   userID: 0, // Will be populated from API if needed
//     //   username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '',
//     //   email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
//     //   roleName: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || ''
//     // };
//     private decodeToken(token: string): User {
//   const decoded = jwtDecode<JwtPayloadWithClaims>(token);

//   return {
//     userID: 0,
//     username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '',
//     email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
//     roleName: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || ''
//   };
// }
//   }
// // interface JwtPayload {
// //   exp?: number;
// //   'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
// //   'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
// //   'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
// // }
//   refreshUserInfo(): Observable<User> {
//     return this.http.get<User>(`${this.API_URL}/User/GetUser`)
//       .pipe(
//         tap(user => {
//           this.setUser(user);
//           this.currentUserSubject.next(user);
//         }),
//         catchError(error => {
//           return throwError(() => error);
//         })
//       );
//   }
// }
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { LoginRequest, User, UserRole } from '../models';

interface JwtPayloadWithClaims extends JwtPayload {
  [CLAIMS.NAME]?: string;
  [CLAIMS.EMAIL]?: string;
  [CLAIMS.ROLE]?: string;
}

const CLAIMS = {
  NAME: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  EMAIL: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
  ROLE: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
} as const;

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private readonly API_URL = 'https://localhost:7048/api';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  constructor(private http: HttpClient) {
    const storedUser = this.getStoredUser();

    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();

    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  // ======================
  // Getters
  // ======================
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // ======================
  // Auth API
  // ======================
  login(credentials: LoginRequest): Observable<string> {
    return this.http.post(`${this.API_URL}/User/UserLogIn`, credentials, {
      responseType: 'text',
    }).pipe(
      tap(token => this.handleAuthSuccess(token)),
      catchError(this.handleError)
    );
  }

  register(userData: { username: string; email: string; password: string; roleID?: number }): Observable<string> {
    const request = {
      username: userData.username,
      email: userData.email,
      passwordHash: userData.password,
      roleID: userData.roleID ?? 4,
      createdAt: new Date()
    };

    return this.http.post(`${this.API_URL}/User/CreateUser`, request, {
      responseType: 'text'
    }).pipe(
      tap(token => this.handleAuthSuccess(token)),
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

  // ======================
  // Role & Permission
  // ======================
  hasRole(role: UserRole | UserRole[]): boolean {
    const user = this.currentUser;
    if (!user?.roleName) return false;

    return Array.isArray(role)
      ? role.includes(user.roleName as UserRole)
      : user.roleName === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return roles.some(r => this.hasRole(r));
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUser;
    if (!user?.roleName) return false;

    const { RolePermissions } = require('../models/role.model');
    const permissions: string[] = RolePermissions[user.roleName as UserRole] || [];

    return permissions.includes(permission);
  }

  // ======================
  // Token Handling
  // ======================
  private handleAuthSuccess(token: string): void {
    this.setToken(token);

    const user = this.decodeToken(token);
    this.updateUser(user);

    this.isAuthenticatedSubject.next(true);
  }

  private decodeToken(token: string): User {
    const decoded = jwtDecode<JwtPayloadWithClaims>(token);

    return {
      userID: 0,
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

      if (typeof decoded.exp !== 'number') {
        return false;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;

    } catch {
      return false;
    }
  }

  // ======================
  // Storage
  // ======================
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

  // ======================
  // Error Handling
  // ======================
  private handleError(error: any) {
    return throwError(() => error);
  }
}