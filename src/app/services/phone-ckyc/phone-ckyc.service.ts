import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PhoneCkycResponse,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  SavePhoneCkycRequest,
  SavePhoneCkycResponse,
} from '../../models/phone-ckyc/phone-ckyc.models';

@Injectable({
  providedIn: 'root',
})
export class PhoneCkycService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPhoneCkyc(): Observable<PhoneCkycResponse> {
    return this.http.get<PhoneCkycResponse>(`${this.apiUrl}/PhoneCkyc`);
  }

  sendOtp(): Observable<SendOtpResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<SendOtpResponse>(
      `${this.apiUrl}/PhoneCkyc/send-otp`,
      {},
      { headers }
    );
  }

  verifyOtp(data: VerifyOtpRequest): Observable<VerifyOtpResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<VerifyOtpResponse>(
      `${this.apiUrl}/PhoneCkyc/verify-otp`,
      data,
      { headers }
    );
  }

  savePhoneCkyc(data: SavePhoneCkycRequest): Observable<SavePhoneCkycResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<SavePhoneCkycResponse>(
      `${this.apiUrl}/PhoneCkyc/save`,
      data,
      { headers }
    );
  }
}
