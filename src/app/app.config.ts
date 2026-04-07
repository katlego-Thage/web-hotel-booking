import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';

import { routes } from './app.routes';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    // Use withInterceptorsFromDi for class-based interceptors
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    ),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['localhost:5001', 'localhost:5000', 'localhost:8080', 'localhost:4200'],
          disallowedRoutes: []
        }
      }),
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        progressBar: true,
        closeButton: true
      })
    )
  ]
};

// import { ApplicationConfig, importProvidersFrom, PLATFORM_ID } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { provideClientHydration } from '@angular/platform-browser';
// import { provideHttpClient, withFetch } from '@angular/common/http';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { isPlatformBrowser } from '@angular/common';
// import { JwtModule } from '@auth0/angular-jwt';
// import { ToastrModule } from 'ngx-toastr';

// import { routes } from './app.routes';

// export function tokenGetter() {
//   return localStorage.getItem('access_token');
// }

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),
//     provideClientHydration(),
//     provideAnimations(),
//     provideHttpClient(withFetch()),
//     importProvidersFrom(
//       JwtModule.forRoot({
//         config: {
//           tokenGetter: tokenGetter,
//           allowedDomains: ['localhost:5001', 'localhost:5000', 'localhost:8080', 'localhost:4200'],
//           disallowedRoutes: []
//         }
//       })
//     ),
//     // Conditionally provide Toastr only in browser
//     // {
//     //   provide: 'TOASTR_CONFIG',
//     //   useFactory: () => {
//     //     if (typeof window !== 'undefined') {
//     //       return ToastrModule.forRoot({
//     //         timeOut: 3000,
//     //         positionClass: 'toast-top-right',
//     //         preventDuplicates: true,
//     //         progressBar: true,
//     //         closeButton: true
//     //       });
//     //     }
//     //     return [];
//     //   }
//     // }
//   ]
// };