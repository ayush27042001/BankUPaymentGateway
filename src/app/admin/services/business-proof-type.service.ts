import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/* =========================================
   REQUEST MODEL
========================================= */

export interface AddBusinessProofTypeRequest {
  proofName: string;
  proofCode: string;
  description: string;
}

/* =========================================
   RESPONSE DATA MODEL
========================================= */

export interface BusinessProofType {
  businessProofTypeId: number;
  proofName: string;
  proofCode: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

/* =========================================
   API RESPONSE MODEL
========================================= */

export interface AddBusinessProofTypeResponse {
  success: boolean;
  message: string;
  data: BusinessProofType;
  errors: string[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class BusinessProofTypeService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  addBusinessProofType(
    data: AddBusinessProofTypeRequest
  ): Observable<AddBusinessProofTypeResponse> {

    return this.http.post<AddBusinessProofTypeResponse>(
      `${this.apiUrl}/BusinessProofTypeMaster`,
      data,
      { headers: this.headers }
    );

  }
getBusinessProofTypes(): Observable<any> {

  return this.http.get(
    `${this.apiUrl}/BusinessProofTypeMaster`,
    { headers: this.headers }
  );

}
getBusinessProofTypeById(id: number): Observable<any> {

  return this.http.get(
    `${this.apiUrl}/BusinessProofTypeMaster/${id}`,
    { headers: this.headers }
  );

}
updateBusinessProofType(data: any): Observable<any> {

  return this.http.put(
    `${this.apiUrl}/BusinessProofTypeMaster`,
    data,
    { headers: this.headers }
  );

}
}