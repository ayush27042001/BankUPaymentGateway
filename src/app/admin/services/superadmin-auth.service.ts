import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  private get headers(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
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
