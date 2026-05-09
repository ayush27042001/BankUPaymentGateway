import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BusinessAddress {
  businessAddressDetailId: number;
  mid: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  hasDifferentOperatingAddress: boolean;
  operatingAddressLine1: string;
  operatingAddressLine2: string;
  operatingCity: string;
  operatingState: string;
  operatingPostalCode: string;
  operatingCountry: string;
  isOnboardingCompleted: boolean;
  isOnboardingRejected: boolean;
  isServiceAgreementSubmitted: boolean;
}

export interface GetBusinessAddressResponse {
  success: boolean;
  message: string;
  data: BusinessAddress;
  errors: string[];
  timestamp: string;
}

export interface SaveBusinessAddressRequest {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  hasDifferentOperatingAddress: boolean;
  operatingAddressLine1: string;
  operatingAddressLine2: string;
  operatingCity: string;
  operatingState: string;
  operatingPostalCode: string;
  operatingCountry: string;
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

export interface SaveBusinessAddressResponse {
  success: boolean;
  message: string;
  data: {
    businessAddressDetailId: number;
    mid: number;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    hasDifferentOperatingAddress: boolean;
    operatingAddressLine1: string;
    operatingAddressLine2: string;
    operatingCity: string;
    operatingState: string;
    operatingPostalCode: string;
    operatingCountry: string;
    message: string;
    onboardingStatus: OnboardingStatus;
  };
  errors: string[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class BusinessAddressService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBusinessAddress(): Observable<GetBusinessAddressResponse> {
    return this.http.get<GetBusinessAddressResponse>(`${this.apiUrl}/BusinessAddress`);
  }

  saveBusinessAddress(
    data: SaveBusinessAddressRequest
  ): Observable<SaveBusinessAddressResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<SaveBusinessAddressResponse>(
      `${this.apiUrl}/BusinessAddress/save`,
      data,
      { headers }
    );
  }
}
