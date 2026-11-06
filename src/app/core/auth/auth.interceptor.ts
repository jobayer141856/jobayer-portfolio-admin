import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToastService } from '../services/toast.service';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  let authReq = req;
  const token = authService.token();

  if (token && req.url.startsWith(environment.apiBaseUrl)) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Avoid refresh loop on auth endpoints
      if (
        error.status === 401 &&
        !req.url.includes('/api/v1/auth/login') &&
        !req.url.includes('/api/v1/auth/refresh')
      ) {
        return authService.refreshToken().pipe(
          switchMap((newToken) => {
            if (newToken) {
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              });
              return next(retryReq);
            }
            router.navigate(['/login']);
            return throwError(() => error);
          }),
        );
      }

      if (error.status === 403) {
        toastService.error('You do not have permission to perform this action.');
      } else if (error.status >= 500) {
        toastService.error('An unexpected server error occurred. Please try again.');
      }

      return throwError(() => error);
    }),
  );
};

