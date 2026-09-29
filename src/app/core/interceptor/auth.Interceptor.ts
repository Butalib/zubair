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
    const clonedReq = addToken(req, tokenService.getAccessToken());
    console.log('clonedReq', clonedReq);
    console.log('currentToken', currentToken);
    return next(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
            console.log('Error in interceptor:', error);
            if (req.url.includes('login') || req.url.includes('signup')) {
                return throwError(() => error);
            }

            const authService = injector.get(AuthService);
            console.log('Auth service:', authService);

            if (error.status === 401) {
                console.log('Unauthorized error, attempting to refresh token...');
                return authService.refreshAccessToken().pipe(
                    switchMap(() => {
                        const newReq = addToken(req, tokenService.getAccessToken());

                        console.log('Retrying request with new token:', newReq);
                        return next(newReq);
                    })
                );
            }

            if (error.status === 403) {
                console.log('Forbidden error, logging out user...');
                authService.logout();
            }

            return throwError(() => error);
        })
    );
};