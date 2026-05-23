import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SaveServiceAgreementRequest {
  signatureData: string;
  agreementDate: string;
  isAccepted: boolean;
}

export interface ServiceAgreementData {
  serviceAgreementId: number;
  mid: number;
  signatureData: string;
  agreementDate: string;
  isAccepted: boolean;
  submittedDate: string;
  isOnboardingCompleted: boolean;
  isOnboardingRejected: boolean;
  isServiceAgreementSubmitted: boolean;
}

export interface GetServiceAgreementResponse {
  success: boolean;
  message: string;
  data: ServiceAgreementData;
  errors: string[];
  timestamp: string;
}

export interface OnboardingStatus {
  stepNumber: number;
  stepName: string;
  isCompleted: boolean;
  isOnboardingCompleted: boolean;
  isOnboardingRejected: boolean;
  isServiceAgreementSubmitted: boolean;
  steps: Array<{
    stepNumber: number;
    stepName: string;
    stepKey: string;
    isCompleted: boolean;
    isActive: boolean;
    connectPlatformSteps?: {
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
  }>;
}

export interface SaveServiceAgreementResponse {
  success: boolean;
  message: string;
  data: {
    serviceAgreementId: number;
    mid: number;
    signatureData: string;
    agreementDate: string;
    isAccepted: boolean;
    submittedDate: string;
    message: string;
    onboardingStatus: OnboardingStatus;
  };
  errors: string[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class ServiceAgreementService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getServiceAgreement(): Observable<GetServiceAgreementResponse> {
    return this.http.get<GetServiceAgreementResponse>(
      `${this.apiUrl}/ServiceAgreement`
    );
  }

  saveServiceAgreement(
    data: SaveServiceAgreementRequest
  ): Observable<SaveServiceAgreementResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<SaveServiceAgreementResponse>(
      `${this.apiUrl}/ServiceAgreement/save`,
      data,
      { headers }
    );
  }
}
