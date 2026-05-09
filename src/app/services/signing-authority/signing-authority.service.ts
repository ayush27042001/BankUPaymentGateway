import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

export interface PepStatus {
  pepstatusId: number;
  statusName: string;
  description: string;
}

export interface PepStatusResponse {
  success: boolean;
  message: string;
  data: PepStatus[];
  errors: string[];
  timestamp: string;
}

export interface SigningAuthorityDetail {
  signingAuthorityDetailId?: number;
  mid?: number;
  signingAuthorityName: string;
  signingAuthorityEmail: string;
  signingAuthorityPan: string;
  pepstatusId: number;
  pepstatusName?: string;
  isOnboardingCompleted?: boolean;
  isOnboardingRejected?: boolean;
  isServiceAgreementSubmitted?: boolean;
}

export interface SigningAuthorityResponse {
  success: boolean;
  message: string;
  data: SigningAuthorityDetail;
  errors: string[];
  timestamp: string;
}

export interface SaveSigningAuthorityRequest {
  signingAuthorityName: string;
  signingAuthorityEmail: string;
  signingAuthorityPan: string;
  pepstatusId: number;
}

export interface SaveSigningAuthorityResponse {
  success: boolean;
  message: string;
  data: SigningAuthorityDetail & {
    onboardingStatus: {
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
      }>;
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
    };
  };
  errors: string[];
  timestamp: string;
}

export interface PanVerificationResponse {
  success: boolean;
  message: string;
  data: {
    isValid: boolean;
    panNumber: string;
    name?: string;
    type?: string;
    referenceId?: number;
    nameMatches?: boolean;
    message?: string;
  };
  errors: string[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class SigningAuthorityService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    });
  }

  getPepStatuses(): Observable<PepStatusResponse> {
    return this.http.get<PepStatusResponse>(
      `${this.apiUrl}/PepstatusMaster`,
      { headers: this.getAuthHeaders() }
    );
  }

  getSigningAuthorityDetails(): Observable<SigningAuthorityResponse> {
    return this.http.get<SigningAuthorityResponse>(
      `${this.apiUrl}/SigningAuthorityDetail`,
      { headers: this.getAuthHeaders() }
    );
  }

  saveSigningAuthorityDetails(
    data: SaveSigningAuthorityRequest
  ): Observable<SaveSigningAuthorityResponse> {
    return this.http.post<SaveSigningAuthorityResponse>(
      `${this.apiUrl}/SigningAuthorityDetail/save`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  verifyPan(panNumber: string): Observable<PanVerificationResponse> {
    return this.http.get<PanVerificationResponse>(
      `${this.apiUrl}/Registration/verify-pan-cashfree?panNumber=${panNumber}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
