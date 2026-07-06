import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface SuperAdminLoginRequest {
  username: string;
  password: string;
}

export interface SuperAdminLoginResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface SuperAdminVerifyOtpRequest {
  username: string;
  otp: string;
}

export interface SuperAdminVerifyOtpResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    refreshToken?: string;
    expiration?: string;
    refreshTokenExpiration?: string;
    username?: string;
    role?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class SuperAdminAuthService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly ADMIN_TOKEN_KEY = 'adminToken';
  private readonly ADMIN_REFRESH_TOKEN_KEY = 'adminRefreshToken';
  private readonly ADMIN_TOKEN_EXPIRATION_KEY = 'adminTokenExpiration';
  private readonly ADMIN_REFRESH_TOKEN_EXPIRATION_KEY = 'adminRefreshTokenExpiration';
  private readonly ADMIN_USERNAME_KEY = 'adminUsername';
  private readonly ADMIN_ROLE_KEY = 'adminRole';

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private get headers(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  getAdminToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.ADMIN_TOKEN_KEY);
  }

  getAdminRefreshToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.ADMIN_REFRESH_TOKEN_KEY);
  }

  getAdminTokenExpiration(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.ADMIN_TOKEN_EXPIRATION_KEY);
  }

  getAdminRefreshTokenExpiration(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.ADMIN_REFRESH_TOKEN_EXPIRATION_KEY);
  }

  isAdminTokenExpired(): boolean {
    const expiration = this.getAdminTokenExpiration();
    if (!expiration) return false;
    return new Date(expiration) <= new Date();
  }

  isAdminRefreshTokenExpired(): boolean {
    const expiration = this.getAdminRefreshTokenExpiration();
    if (!expiration) return false;
    return new Date(expiration) <= new Date();
  }

  updateAdminTokens(
    token: string,
    refreshToken: string,
    tokenExpiration?: string,
    refreshTokenExpiration?: string
  ): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.ADMIN_TOKEN_KEY, token);
    localStorage.setItem(this.ADMIN_REFRESH_TOKEN_KEY, refreshToken);
    if (tokenExpiration) {
      localStorage.setItem(this.ADMIN_TOKEN_EXPIRATION_KEY, tokenExpiration);
    }
    if (refreshTokenExpiration) {
      localStorage.setItem(this.ADMIN_REFRESH_TOKEN_EXPIRATION_KEY, refreshTokenExpiration);
    }
  }

  getAdminRole(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.ADMIN_ROLE_KEY);
  }

  isAdminAuthenticated(): boolean {
    if (!this.isBrowser()) return false;
    const token = this.getAdminToken();
    const role = this.getAdminRole();
    return !!token && !!role && role.toLowerCase() === 'superadmin';
  }

  logoutAdmin(): void {
    if (!this.isBrowser()) {
      this.router.navigate(['/superadmin-login']);
      return;
    }
    localStorage.removeItem(this.ADMIN_TOKEN_KEY);
    localStorage.removeItem(this.ADMIN_REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.ADMIN_TOKEN_EXPIRATION_KEY);
    localStorage.removeItem(this.ADMIN_REFRESH_TOKEN_EXPIRATION_KEY);
    localStorage.removeItem(this.ADMIN_USERNAME_KEY);
    localStorage.removeItem(this.ADMIN_ROLE_KEY);
    this.router.navigate(['/superadmin-login']);
  }

  refreshAdminToken(): Observable<any> {
    const refreshToken = this.getAdminRefreshToken();
    const expiredToken = this.getAdminToken();

    if (!refreshToken || !expiredToken) {
      this.logoutAdmin();
      return new Observable(observer => {
        observer.error('No admin refresh token or expired token available');
      });
    }

    return this.http.post<any>(
      `${this.apiUrl}/Admin/refresh-token`,
      { refreshToken, expiredToken },
      { headers: this.headers }
    );
  }

  superAdminLogin(data: SuperAdminLoginRequest): Observable<SuperAdminLoginResponse> {
    return this.http.post<SuperAdminLoginResponse>(
      `${this.apiUrl}/Admin/login`,
      data,
      { headers: this.headers }
    );
  }

  verifyAdminOtp(data: SuperAdminVerifyOtpRequest): Observable<SuperAdminVerifyOtpResponse> {
    return this.http.post<SuperAdminVerifyOtpResponse>(
      `${this.apiUrl}/Admin/verify-otp`,
      data,
      { headers: this.headers }
    );
  }
  setAdminAuthData(
  token: string,
  refreshToken?: string,
  tokenExpiration?: string,
  refreshTokenExpiration?: string
): void {

  localStorage.setItem('adminToken', token);

  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }

  if (tokenExpiration) {
    localStorage.setItem('tokenExpiration', tokenExpiration);
  }

  if (refreshTokenExpiration) {
    localStorage.setItem(
      'refreshTokenExpiration',
      refreshTokenExpiration
    );
  }

}
}
