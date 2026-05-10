import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DocumentType {
  documentTypeId: number;
  documentName: string;
  documentCode: string;
  allowedExtensions: string;
  maxFileSizeMb: number;
  isRequired: boolean;
  isActive: boolean;
}

export interface DocumentTypesResponse {
  success: boolean;
  message: string;
  data: DocumentType[];
  errors: string[];
  timestamp: string;
}

export interface UploadedDocument {
  documentUploadId: number;
  mid: number;
  documentTypeId: number;
  documentTypeName: string;
  documentTypeCode: string;
  documentFileName: string;
  documentFilePath: string;
  documentSizeBytes: number;
  documentMimeType: string;
  isVerified: boolean;
  createdDate: string;
  updatedDate: string;
}

export interface OnboardingStatus {
  stepNumber: number;
  stepName: string;
  isCompleted: boolean;
  isOnboardingCompleted: boolean;
  isOnboardingRejected: boolean;
  isServiceAgreementSubmitted: boolean;
  steps: any[];
}

export interface UploadDocumentResponse {
  success: boolean;
  message: string;
  data: {
    documentUploadId: number;
    documentFileName: string;
    documentFilePath: string;
    message: string;
    onboardingStatus: OnboardingStatus;
  };
  errors: string[];
  timestamp: string;
}

export interface UpdateDocumentResponse {
  success: boolean;
  message: string;
  data: {
    documentUploadId: number;
    documentFileName: string;
    documentFilePath: string;
    message: string;
    onboardingStatus: OnboardingStatus;
  };
  errors: string[];
  timestamp: string;
}

export interface GetDocumentResponse {
  success: boolean;
  message: string;
  data: UploadedDocument;
  errors: string[];
  timestamp: string;
}

export interface GetMerchantDocumentsResponse {
  success: boolean;
  message: string;
  data: {
    documents: UploadedDocument[];
    totalCount: number;
  };
  errors: string[];
  timestamp: string;
}

export interface DeleteDocumentResponse {
  success: boolean;
  message: string;
  data: string;
  errors: string[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDocumentTypes(): Observable<DocumentTypesResponse> {
    return this.http.get<DocumentTypesResponse>(`${this.apiUrl}/Document/types`);
  }

  uploadDocument(documentTypeId: number, businessProofTypeId: number, file: File): Observable<UploadDocumentResponse> {
    const formData = new FormData();
    formData.append('DocumentTypeId', documentTypeId.toString());
    formData.append('BusinessProofTypeId', businessProofTypeId ? businessProofTypeId.toString() : '');
    formData.append('File', file);

    return this.http.post<UploadDocumentResponse>(`${this.apiUrl}/Document/upload`, formData);
  }

  updateDocument(documentUploadId: number, documentTypeId: number, businessProofTypeId: number, file: File): Observable<UpdateDocumentResponse> {
    const formData = new FormData();
    formData.append('DocumentUploadId', documentUploadId.toString());
    formData.append('DocumentTypeId', documentTypeId.toString());
    formData.append('BusinessProofTypeId', businessProofTypeId ? businessProofTypeId.toString() : '');
    formData.append('File', file);

    return this.http.post<UpdateDocumentResponse>(`${this.apiUrl}/Document/update`, formData);
  }

  getDocumentById(documentUploadId: number): Observable<GetDocumentResponse> {
    return this.http.get<GetDocumentResponse>(`${this.apiUrl}/Document/${documentUploadId}`);
  }

  getMerchantDocuments(): Observable<GetMerchantDocumentsResponse> {
    return this.http.get<GetMerchantDocumentsResponse>(`${this.apiUrl}/Document/merchant`);
  }

  getDocumentsByType(documentTypeId: number): Observable<GetMerchantDocumentsResponse> {
    return this.http.get<GetMerchantDocumentsResponse>(`${this.apiUrl}/Document/type/${documentTypeId}`);
  }

  downloadDocument(documentUploadId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/Document/download/${documentUploadId}`, {
      responseType: 'blob',
    });
  }

  deleteDocument(documentUploadId: number): Observable<DeleteDocumentResponse> {
    return this.http.post<DeleteDocumentResponse>(`${this.apiUrl}/Document/delete/${documentUploadId}`, {});
  }
}
