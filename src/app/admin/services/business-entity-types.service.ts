import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/* =========================================
   REQUEST MODEL
========================================= */

export interface AddBusinessEntityTypeRequest {
  entityName: string;
  description: string;
}

export interface UpdateBusinessEntityTypeRequest {
  businessEntityTypeId: number;
  entityName: string;
  description: string;
  isActive: boolean;
}

/* =========================================
   RESPONSE DATA MODEL
========================================= */

export interface BusinessEntityType {
  businessEntityTypeId: number;
  entityName: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

/* =========================================
   API RESPONSE MODEL
========================================= */

export interface BusinessEntityTypeResponse {
  success: boolean;
  message: string;
  data: BusinessEntityType;
  errors: string[];
  timestamp: string;
}

/* =========================================
   LIST RESPONSE MODEL
========================================= */

export interface BusinessEntityTypesListResponse {
  success: boolean;
  message: string;
  data: {
    items: BusinessEntityType[];
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
export class BusinessEntityTypesService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  addBusinessEntityType(
    data: AddBusinessEntityTypeRequest
  ): Observable<BusinessEntityTypeResponse> {

    return this.http.post<BusinessEntityTypeResponse>(
      `${this.apiUrl}/BusinessEntityTypeMaster`,
      data,
      { headers: this.headers }
    );

  }

  getBusinessEntityTypeById(
    id: number
  ): Observable<BusinessEntityTypeResponse> {

    return this.http.get<BusinessEntityTypeResponse>(
      `${this.apiUrl}/BusinessEntityTypeMaster/${id}`,
      { headers: this.headers }
    );

  }

  getBusinessEntityTypesList(
    pageNumber: number,
    pageSize: number,
    search: string = ''
  ): Observable<BusinessEntityTypesListResponse> {

    let url =
      `${this.apiUrl}/BusinessEntityTypeMaster/list?PageNumber=${pageNumber}&PageSize=${pageSize}&Search=${search}`;

    return this.http.get<BusinessEntityTypesListResponse>(
      url,
      { headers: this.headers }
    );

  }

  updateBusinessEntityType(
    data: UpdateBusinessEntityTypeRequest
  ): Observable<BusinessEntityTypeResponse> {

    return this.http.put<BusinessEntityTypeResponse>(
      `${this.apiUrl}/BusinessEntityTypeMaster`,
      data,
      { headers: this.headers }
    );

  }

}
