import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const token = auth.getToken();

    const isAuthRequest =
        req.url.includes('/login') ||
        req.url.includes('/register');

    let reqToSend = req;
    if (token && !isAuthRequest) {
        reqToSend = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
        });
    }

    return next(reqToSend).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
                auth.clearSession();
                router.navigate(['/login']);
            }
            return throwError(() => err);
        })
    );
};