import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/* =========================================
   REQUEST MODEL
======================================== */

export interface AddBusinessSubCategoryRequest {
  businessCategoryId: number;
  subCategoryName: string;
  subCategoryCode: string;
  description: string;
  isActive: boolean;
}

/* =========================================
   RESPONSE DATA MODEL
======================================== */

export interface BusinessSubCategory {
  businessSubCategoryId: number;
  businessCategoryId: number;
  categoryName: string;
  subCategoryName: string;
  subCategoryCode: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

/* =========================================
   API RESPONSE MODEL
======================================== */

export interface AddBusinessSubCategoryResponse {
  success: boolean;
  message: string;
  data: BusinessSubCategory;
  errors: string[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class BusinessSubCategoryService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  addBusinessSubCategory(
    data: AddBusinessSubCategoryRequest
  ): Observable<AddBusinessSubCategoryResponse> {

    return this.http.post<AddBusinessSubCategoryResponse>(
      `${this.apiUrl}/BusinessSubCategoryMaster`,
      data,
      { headers: this.headers }
    );

  }

  getBusinessSubCategoryById(
    id: number
  ): Observable<AddBusinessSubCategoryResponse> {

    return this.http.get<AddBusinessSubCategoryResponse>(
      `${this.apiUrl}/BusinessSubCategoryMaster/${id}`,
      { headers: this.headers }
    );

  }

  getBusinessSubCategoriesList(
    pageNumber: number,
    pageSize: number,
    search: string = '',
    isActive?: boolean | null,
    businessCategoryId?: number | null
  ): Observable<any> {

    let url =
      `${this.apiUrl}/BusinessSubCategoryMaster/list?PageNumber=${pageNumber}&PageSize=${pageSize}&Search=${search}`;

    if (isActive !== null && isActive !== undefined) {
      url += `&IsActive=${isActive}`;
    }

    if (businessCategoryId !== null && businessCategoryId !== undefined) {
      url += `&BusinessCategoryId=${businessCategoryId}`;
    }

    return this.http.get<any>(
      url,
      { headers: this.headers }
    );

  }

  updateBusinessSubCategory(
    data: any
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/BusinessSubCategoryMaster`,
      data,
      { headers: this.headers }
    );

  }

  getCategoriesList(): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/BusinessCategoryMaster/list?PageNumber=1&PageSize=100&Search=`,
      { headers: this.headers }
    );

  }

}
