import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/* =========================================
   REQUEST MODELS
========================================= */

export interface AddPepStatusRequest {
  statusName: string;
  description: string;
}

export interface UpdatePepStatusRequest {
  pepstatusId: number;
  statusName: string;
  description: string;
  isActive: boolean;
}

/* =========================================
   RESPONSE DATA MODEL
========================================= */

export interface PepStatus {
  pepstatusId: number;
  statusName: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

/* =========================================
   API RESPONSE MODELS
========================================= */

export interface PepStatusResponse {
  success: boolean;
  message: string;
  data: PepStatus;
  errors: string[];
  timestamp: string;
}

export interface PepStatusListResponse {
  success: boolean;
  message: string;
  data: {
    items: PepStatus[];
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
export class PepStatusService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  addPepStatus(
    data: AddPepStatusRequest
  ): Observable<PepStatusResponse> {

    return this.http.post<PepStatusResponse>(
      `${this.apiUrl}/PepstatusMaster`,
      data,
      { headers: this.headers }
    );

  }

  getPepStatusById(
    id: number
  ): Observable<PepStatusResponse> {

    return this.http.get<PepStatusResponse>(
      `${this.apiUrl}/PepstatusMaster/${id}`,
      { headers: this.headers }
    );

  }

  getPepStatusList(
    pageNumber: number,
    pageSize: number,
    search: string = ''
  ): Observable<PepStatusListResponse> {

    let url =
      `${this.apiUrl}/PepstatusMaster/list?PageNumber=${pageNumber}&PageSize=${pageSize}&Search=${search}`;

    return this.http.get<PepStatusListResponse>(
      url,
      { headers: this.headers }
    );

  }

  updatePepStatus(
    data: UpdatePepStatusRequest
  ): Observable<PepStatusResponse> {

    return this.http.put<PepStatusResponse>(
      `${this.apiUrl}/PepstatusMaster`,
      data,
      { headers: this.headers }
    );

  }

}
