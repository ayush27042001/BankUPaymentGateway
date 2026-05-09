import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BusinessDetailsResponse {
  success: boolean;
  message: string;
  data: {
    mid: number;
    hasGstin: boolean;
    expectedSalesPerMonth?: number;
    gstin?: string;
    isOnboardingCompleted?: boolean;
    isServiceAgreementSubmitted?: boolean;
    isOnboardingRejected?: boolean;
  };
  errors: string[];
  timestamp: string;
}

export interface ValidateGstRequest {
  gstin: string;
  businessName: string;
}

export interface ValidateGstResponse {
  success: boolean;
  message: string;
  data: {
    isValid: boolean;
    legalName?: string;
    tradeName?: string;
  };
  errors: string[];
  timestamp: string;
}

export interface SaveBusinessDetailsRequest {
  expectedSalesPerMonth: number;
  hasGstin: boolean;
  gstin?: string;
}

export interface SaveBusinessDetailsResponse {
  success: boolean;
  message: string;
  data: {
    mid: number;
    expectedSalesPerMonth: number;
    hasGstin: boolean;
    gstin?: string;
    message: string;
    formStep: string;
    step: number;
    isOnboardingCompleted: boolean;
    isServiceAgreementSubmitted: boolean;
    isOnboardingRejected: boolean;
    onboardingStatus: {
      stepNumber: number;
      stepName: string;
      isCompleted: boolean;
      isOnboardingCompleted: boolean;
      isServiceAgreementSubmitted: boolean;
      isOnboardingRejected: boolean;
      steps: Array<{
        stepNumber: number;
        stepName: string;
        stepKey: string;
        isCompleted: boolean;
        isActive: boolean;
      }>;
    };
  };
  errors: string[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class BusinessDetailsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBusinessDetails(): Observable<BusinessDetailsResponse> {
    return this.http.get<BusinessDetailsResponse>(
      `${this.apiUrl}/BusinessDetails`
    );
  }

  validateGst(data: ValidateGstRequest): Observable<ValidateGstResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<ValidateGstResponse>(
      `${this.apiUrl}/BusinessDetails/validate-gst`,
      data,
      { headers }
    );
  }

  saveBusinessDetails(
    data: SaveBusinessDetailsRequest
  ): Observable<SaveBusinessDetailsResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<SaveBusinessDetailsResponse>(
      `${this.apiUrl}/BusinessDetails/save`,
      data,
      { headers }
    );
  }
}
