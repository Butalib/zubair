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

    // data layer
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
                this.currentUser.set(JSON.parse(storedUser));
            }
        }
    }
    // Method authentication


    register(body: { phone: string; password: string; displayName: string }) {
        return this.dataservice.postData<IUser>('/auth/signup', body).pipe(
            tap((response: IUser) => {
                this.saveAuthData(response, response.accessToken, response.refreshToken);
            })
        );
    }

    login(body: { phone: string; password: string }) {
        return this.dataservice.postData<IUser>('/auth/login', body).pipe(
            tap((response: IUser) => {
                this.saveAuthData(response, response.accessToken, response.refreshToken);
            })
        );
    }

    logout() {
        this.clearAuthData();
        this.router.navigate(['/login']);
    }

    // Method to refresh the access token - Tokens Rotation 

    refreshAccessToken() {
        const currentRefreshToken = this.tokenService.getRefreshToken();

        if (!currentRefreshToken) {
            this.logout();
            return throwError(() => new Error('No refresh token available'));
        }
        return this.dataservice.postData<any>('/auth/refresh', { refreshToken: currentRefreshToken }).pipe(
            tap((response: any) => {
                const user = this.currentUser();
                if (user) {
                    this.saveAuthData(user, response.accessToken, response.refreshToken);
                }
            })
        );
    }
}