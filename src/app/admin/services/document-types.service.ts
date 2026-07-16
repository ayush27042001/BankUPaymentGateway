import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/* =========================================
   REQUEST MODELS
========================================= */

export interface AddDocumentTypeRequest {
  documentName: string;
  documentCode: string;
  allowedExtensions: string;
  maxFileSizeMb: number;
  isRequired: boolean;
}

export interface UpdateDocumentTypeRequest {
  documentTypeId: number;
  documentName: string;
  documentCode: string;
  allowedExtensions: string;
  maxFileSizeMb: number;
  isRequired: boolean;
  isActive: boolean;
}

/* =========================================
   RESPONSE DATA MODEL
========================================= */

export interface DocumentType {
  documentTypeId: number;
  documentName: string;
  documentCode: string;
  allowedExtensions: string;
  maxFileSizeMb: number;
  isRequired: boolean;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

/* =========================================
   API RESPONSE MODELS
========================================= */

export interface DocumentTypeResponse {
  success: boolean;
  message: string;
  data: DocumentType;
  errors: string[];
  timestamp: string;
}

export interface DocumentTypesListResponse {
  success: boolean;
  message: string;
  data: {
    items: DocumentType[];
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
export class DocumentTypesService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  addDocumentType(
    data: AddDocumentTypeRequest
  ): Observable<DocumentTypeResponse> {

    return this.http.post<DocumentTypeResponse>(
      `${this.apiUrl}/DocumentTypeMaster`,
      data,
      { headers: this.headers }
    );

  }

  getDocumentTypeById(
    id: number
  ): Observable<DocumentTypeResponse> {

    return this.http.get<DocumentTypeResponse>(
      `${this.apiUrl}/DocumentTypeMaster/${id}`,
      { headers: this.headers }
    );

  }

  getDocumentTypesList(
    pageNumber: number,
    pageSize: number,
    search: string = ''
  ): Observable<DocumentTypesListResponse> {

    let url =
      `${this.apiUrl}/DocumentTypeMaster/list?PageNumber=${pageNumber}&PageSize=${pageSize}&Search=${search}`;

    return this.http.get<DocumentTypesListResponse>(
      url,
      { headers: this.headers }
    );

  }

  updateDocumentType(
    data: UpdateDocumentTypeRequest
  ): Observable<DocumentTypeResponse> {

    return this.http.put<DocumentTypeResponse>(
      `${this.apiUrl}/DocumentTypeMaster`,
      data,
      { headers: this.headers }
    );

  }

}
