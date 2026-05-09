import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ConnectPlatformGetResponse {
  success: boolean;
  message: string;
  data: {
    mid: number;
    paymentCollectionPreference: string;
    websiteAppUrl: string;
    androidAppUrl: string;
    iosAppUrl: string;
    isOnboardingCompleted?: boolean;
    isServiceAgreementSubmitted?: boolean;
    isOnboardingRejected?: boolean;
  };
  errors: string[];
  timestamp: string;
}

export interface SaveConnectPlatformRequest {
  paymentCollectionPreference: string;
  websiteAppUrl: string;
  androidAppUrl: string;
  iosAppUrl: string;
}

export interface SaveConnectPlatformResponse {
  success: boolean;
  message: string;
  data: {
    mid: number;
    paymentCollectionPreference: string;
    websiteAppUrl: string;
    androidAppUrl: string;
    iosAppUrl: string;
    message: string;
    formStep: string;
    step: number;
    onboardingStatus: {
      stepNumber: number;
      stepName: string;
      isCompleted: boolean;
      steps: Array<{
        stepNumber: number;
        stepName: string;
        stepKey: string;
        isCompleted: boolean;
        isActive: boolean;
      }>;
      connectPlatformSteps: {
        currentStep: number;
        totalSteps: number;
        steps: Array<{
          stepNumber: number;
          stepName: string;
          stepKey: string;
          isCompleted: boolean;
          isActive: boolean;
        }>;
      };
    };
  };
  errors: string[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConnectPlatformService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getConnectPlatform(): Observable<ConnectPlatformGetResponse> {
    return this.http.get<ConnectPlatformGetResponse>(`${this.apiUrl}/ConnectPlatform`);
  }

  saveConnectPlatform(
    data: SaveConnectPlatformRequest
  ): Observable<SaveConnectPlatformResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<SaveConnectPlatformResponse>(
      `${this.apiUrl}/ConnectPlatform/save`,
      data,
      { headers }
    );
  }
}
