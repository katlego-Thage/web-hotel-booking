import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../services';
import { Observable, catchError, throwError } from 'rxjs';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(
    private auth: Auth,
    private router: Router
  ) { }
  
 intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the auth token from the service
    const authToken = this.auth.token;

    //add the authorization header if token exists
    if (authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    // Handle the request and catch errors
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized - token expired or invalid
          this.auth.logout();  
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url }
          });
        } else if (error.status === 403) {
          // Forbidden - user doesn't have permission
          this.router.navigate(['/unauthorized']);
        }
        return throwError(() => error);
      })
    );
  }
}

// Error interceptor for global error handling
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = error.error?.message || error.message || `Error Code: ${error.status}`;
        }
        
        console.error('HTTP Error:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
 
