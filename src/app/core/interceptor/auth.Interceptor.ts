import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service/auth.service';
import { TokenService } from '../services/auth-service/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const tokenService = inject(TokenService);
    const injector = inject(Injector);

    const addToken = (request: any, token: string | null) => {
        if (!token) return request;
        return request.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    };

    const currentToken = tokenService.getAccessToken();
    const clonedReq = addToken(req, currentToken);

    return next(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (
                req.url.includes('login') ||
                req.url.includes('signup') ||
                req.url.includes('refresh')
            ) {
                return throwError(() => error);
            }

            const authService = injector.get(AuthService);

            if (error.status === 401) {
                return authService.refreshAccessToken().pipe(
                    switchMap(() => {
                        const newReq = addToken(req, tokenService.getAccessToken());
                        return next(newReq);
                    }),
                    catchError((refreshError: unknown) => {
                        authService.logout();
                        return throwError(() => refreshError);
                    })
                );
            }

            if (error.status === 403) {
                authService.logout();
            }

            return throwError(() => error);
        })
    );
};