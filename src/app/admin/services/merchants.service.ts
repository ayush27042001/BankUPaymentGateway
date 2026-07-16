import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/* =========================================
   REQUEST MODEL
========================================= */

export interface AddMerchantRequest {
  userId: number;
  businessName: string;
  businessEntityTypeId: number;
  businessCategoryId?: number;
  businessSubCategoryId?: number;
  expectedSalesPerMonth: number;
  hasGstin: boolean;
  gstin: string;
  ckycconsentGiven: boolean;
  ckycidentifier: string;
}

/* =========================================
   RESPONSE DATA MODEL
========================================= */

export interface Merchant {
  mid: number;
  userId: number;
  businessName: string;
  businessEntityTypeId: number;
  onboardingStatusId: number;
  ckycidentifier: string;
  expectedSalesPerMonth: number;
  gstin: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

/* =========================================
   API RESPONSE MODELS
========================================= */

export interface MerchantResponse {
  success: boolean;
  message: string;
  data: Merchant;
  errors: string[];
  timestamp: string;
}

export interface MerchantListResponse {
  success: boolean;
  message: string;
  data: {
    items: Merchant[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  errors: string[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class MerchantsService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  addMerchant(
    data: AddMerchantRequest
  ): Observable<MerchantResponse> {

    return this.http.post<MerchantResponse>(
      `${this.apiUrl}/MerchantMaster`,
      data,
      { headers: this.headers }
    );

  }

  getMerchantById(
    mid: number
  ): Observable<MerchantResponse> {

    return this.http.get<MerchantResponse>(
      `${this.apiUrl}/MerchantMaster/${mid}`,
      { headers: this.headers }
    );

  }

  getMerchantList(
    pageNumber: number,
    pageSize: number,
    search: string = ''
  ): Observable<MerchantListResponse> {

    let url =
      `${this.apiUrl}/MerchantMaster/list?PageNumber=${pageNumber}&PageSize=${pageSize}&Search=${search}`;

    return this.http.get<MerchantListResponse>(
      url,
      { headers: this.headers }
    );

  }

}
