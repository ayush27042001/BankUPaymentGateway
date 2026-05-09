import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

export interface BusinessProofType {
  businessProofTypeId: number;
  proofName: string;
  proofCode: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

export interface BusinessProofTypeResponse {
  success: boolean;
  message: string;
  data: BusinessProofType[];
  errors: string[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class BusinessProofTypeService {
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

  getBusinessProofTypes(): Observable<BusinessProofTypeResponse> {
    return this.http.get<BusinessProofTypeResponse>(
      `${this.apiUrl}/BusinessProofTypeMaster`,
      { headers: this.getAuthHeaders() }
    );
  }
}
