import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BankAccountDetail {
  bankAccountDetailId: number;
  mid: number;
  bankHolderName: string;
  bankAccountNumber: string;
  ifsccode: string;
  bankName: string;
  accountType: string;
  isVerified: boolean;
  verifiedDate: string;
  isOnboardingCompleted: boolean;
  isOnboardingRejected: boolean;
  isServiceAgreementSubmitted: boolean;
}

export interface GetBankAccountDetailResponse {
  success: boolean;
  message: string;
  data: BankAccountDetail;
  errors: string[];
  timestamp: string;
}

export interface VerifyBankDetailsData {
  isValid: boolean;
  isNameMatched: boolean;
  accountStatus?: string;
  nameAtBank?: string;
  bankName?: string;
  message: string;
}

export interface VerifyBankDetailsResponse {
  success: boolean;
  message: string;
  data: VerifyBankDetailsData;
  errors: string[];
  timestamp: string;
}

export interface SaveBankAccountDetailRequest {
  bankHolderName: string;
  bankAccountNumber: string;
  ifsccode: string;
  bankName: string;
  accountType: string;
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

export interface SaveBankAccountDetailResponse {
  success: boolean;
  message: string;
  data: {
    bankAccountDetailId: number;
    mid: number;
    bankHolderName: string;
    bankAccountNumber: string;
    ifsccode: string;
    accountType: string;
    message: string;
    onboardingStatus: OnboardingStatus;
  };
  errors: string[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class BankAccountDetailsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBankAccountDetail(): Observable<GetBankAccountDetailResponse> {
    return this.http.get<GetBankAccountDetailResponse>(
      `${this.apiUrl}/BankAccountDetail`
    );
  }

  verifyBankDetails(
    bankAccountNumber: string,
    ifscCode: string
  ): Observable<VerifyBankDetailsResponse> {
    return this.http.get<VerifyBankDetailsResponse>(
      `${this.apiUrl}/BankAccountDetail/verify?bankAccountNumber=${bankAccountNumber}&ifscCode=${ifscCode}`
    );
  }

  saveBankAccountDetail(
    data: SaveBankAccountDetailRequest
  ): Observable<SaveBankAccountDetailResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<SaveBankAccountDetailResponse>(
      `${this.apiUrl}/BankAccountDetail/save`,
      data,
      { headers }
    );
  }
}
