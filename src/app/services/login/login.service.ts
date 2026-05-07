import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../../models/auth/auth.models';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  login(data: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/Auth/login`,
      data,
      { headers }
    );
  }

  sendOtp(data: SendOtpRequest): Observable<SendOtpResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<SendOtpResponse>(
      `${this.apiUrl}/Auth/send-otp`,
      data,
      { headers }
    );
  }

  verifyOtp(data: VerifyOtpRequest): Observable<VerifyOtpResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<VerifyOtpResponse>(
      `${this.apiUrl}/Auth/verify-otp`,
      data,
      { headers }
    );
  }

  refreshToken(data: RefreshTokenRequest): Observable<RefreshTokenResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<RefreshTokenResponse>(
      `${this.apiUrl}/Auth/refresh-token`,
      data,
      { headers }
    );
  }
}
