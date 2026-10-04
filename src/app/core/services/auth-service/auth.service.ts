import { inject, Injectable, signal, WritableSignal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IUser } from 'src/app/core/interfaces/project-interfaces';
import { tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { DataService } from '../data/data.service';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private dataservice = inject(DataService);
    private router = inject(Router);
    private tokenService = inject(TokenService);
    private platformId = inject(PLATFORM_ID);

    public currentUser: WritableSignal<IUser | null> = signal(null);

    constructor() {
        this.loadUserFromStorage();
    }

    saveAuthData(user: IUser, accessToken: string, refreshToken: string) {
        this.currentUser.set(user);
        this.tokenService.setAccessToken(accessToken);
        this.tokenService.setRefreshToken(refreshToken);

        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('userData', JSON.stringify(user));
        }
    }

    clearAuthData() {
        this.currentUser.set(null);
        this.tokenService.clearTokens();
    }

    private loadUserFromStorage() {
        if (isPlatformBrowser(this.platformId)) {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                try {
                    this.currentUser.set(JSON.parse(storedUser));
                } catch {
                    this.clearAuthData();
                }
            }
        }
    }
    // Method authentication


    register(body: { phone: string; password: string; displayName: string }) {
        return this.dataservice.postData<any>('auth/signup', body).pipe(
            tap((response) => {
                const user = response.data || response;
                this.saveAuthData(user, response.accessToken, response.refreshToken);
            })
        );
    }

    login(body: { phone: string; password: string }) {
        return this.dataservice.postData<any>('auth/login', body).pipe(
            tap((response) => {
                const user = response.data || response;
                this.saveAuthData(user, response.accessToken, response.refreshToken);
            })
        );
    }

    logout() {
        this.clearAuthData();
        this.router.navigate(['/login']);
        return this.dataservice.postData('auth/logout', {
            "token": { "$gt": "" }
        }).pipe(
            tap(() => {
                this.clearAuthData();
            })
        );
    }

    sendOtp(body: { phone: string }) {
        return this.dataservice.postData('auth/createVerificationCodeCheck', body);
    }

    /** Used after signup — sends OTP via createVerificationCode */
    sendVerificationCode(body: { phone: string }) {
        return this.dataservice.postData('auth/createVerificationCode', body);
    }

    verifyOtp(body: { phone: string; code: string }) {
        return this.dataservice.postData('auth/verify', body);
    }

    resetPassword(body: { phone: string; code: string; newPassword: string }) {
        return this.dataservice.postData('auth/forgetPassword', {
            phone: body.phone,
            code: body.code,
            password: body.newPassword
        });
    }

    // Method to refresh the access token - Tokens Rotation 

    refreshAccessToken() {
        const currentRefreshToken = this.tokenService.getRefreshToken();

        if (!currentRefreshToken) {
            this.logout();
            return throwError(() => new Error('No refresh token available'));
        }
        return this.dataservice.postData<{ accessToken: string; refreshToken: string }>('auth/refresh', { refreshToken: currentRefreshToken }).pipe(
            tap((response) => {
                this.tokenService.setAccessToken(response.accessToken);
                this.tokenService.setRefreshToken(response.refreshToken);

                const user = this.currentUser();
                if (user) {
                    this.saveAuthData(user, response.accessToken, response.refreshToken);
                }
            })
        );
    }
}