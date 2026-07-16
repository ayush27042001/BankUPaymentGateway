import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/* =========================================
   REQUEST MODEL
========================================= */

export interface AddBusinessCategoryRequest {
  categoryName: string;
  categoryCode: string;
  description: string;
  isActive: boolean;
}

/* =========================================
   RESPONSE DATA MODEL
========================================= */

export interface BusinessCategory {
  businessCategoryId: number;
  categoryName: string;
  categoryCode: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

/* =========================================
   API RESPONSE MODEL
========================================= */

export interface AddBusinessCategoryResponse {
  success: boolean;
  message: string;
  data: BusinessCategory;
  errors: string[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class BusinessCategoryService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  addBusinessCategory(
    data: AddBusinessCategoryRequest
  ): Observable<AddBusinessCategoryResponse> {

    return this.http.post<AddBusinessCategoryResponse>(
      `${this.apiUrl}/BusinessCategoryMaster`,
      data,
      { headers: this.headers }
    );

  }

  getBusinessCategoryById(
    id: number
  ): Observable<AddBusinessCategoryResponse> {

    return this.http.get<AddBusinessCategoryResponse>(
      `${this.apiUrl}/BusinessCategoryMaster/${id}`,
      { headers: this.headers }
    );

  }

  getBusinessCategoriesList(
    pageNumber: number,
    pageSize: number,
    search: string = '',
    isActive?: boolean | null
  ): Observable<any> {

    let url =
      `${this.apiUrl}/BusinessCategoryMaster/list?PageNumber=${pageNumber}&PageSize=${pageSize}&Search=${search}`;

    if (isActive !== null && isActive !== undefined) {
      url += `&IsActive=${isActive}`;
    }

    return this.http.get<any>(
      url,
      { headers: this.headers }
    );

  }

  updateBusinessCategory(
    data: any
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/BusinessCategoryMaster`,
      data,
      { headers: this.headers }
    );

  }

}