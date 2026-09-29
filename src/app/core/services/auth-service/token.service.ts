import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class TokenService {

    private platformId = inject(PLATFORM_ID);

    setAccessToken(token: string) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('accessToken', token);
        }
    }

    getAccessToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('accessToken');
        }
        return null;
    }

    setRefreshToken(token: string) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('refreshToken', token);
        }
    }

    getRefreshToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('refreshToken');
        }
        return null;
    }

    clearTokens() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userData');
        }
    }
}