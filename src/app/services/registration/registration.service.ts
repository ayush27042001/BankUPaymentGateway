import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  RegistrationRequest,
  RegistrationResponse,
  RegistrationError,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpResponse,
  ValidatePanResponse,
  VerifyPanCashfreeResponse,
} from '../../models/registration/registration.models';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  initiateRegistration(
    data: RegistrationRequest
  ): Observable<RegistrationResponse | RegistrationError> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<RegistrationResponse | RegistrationError>(
      `${this.apiUrl}/Registration/initiate`,
      data,
      { headers }
    );
  }

  verifyOtp(
    data: VerifyOtpRequest
  ): Observable<VerifyOtpResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<VerifyOtpResponse>(
      `${this.apiUrl}/Registration/verify-otp`,
      data,
      { headers }
    );
  }

  resendOtp(
    mobileNumber: string,
    registrationToken: string
  ): Observable<ResendOtpResponse> {
    return this.http.post<ResendOtpResponse>(
      `${this.apiUrl}/Registration/resend-otp?mobileNumber=${mobileNumber}&registrationToken=${registrationToken}`,
      {}
    );
  }

  validatePan(panNumber: string): Observable<ValidatePanResponse> {
    return this.http.get<ValidatePanResponse>(
      `${this.apiUrl}/Registration/validate-pan?panNumber=${panNumber}`
    );
  }

  verifyPanCashfree(panNumber: string): Observable<VerifyPanCashfreeResponse> {
    return this.http.get<VerifyPanCashfreeResponse>(
      `${this.apiUrl}/Registration/verify-pan-cashfree?panNumber=${panNumber}`
    );
  }
}
