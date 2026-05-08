import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  BusinessEntityTypesResponse,
  BusinessEntityResponse,
  SaveBusinessEntityRequest,
  SaveBusinessEntityResponse,
  BusinessCategoriesResponse,
  BusinessCategoryResponse,
  SaveBusinessCategoryRequest,
  SaveBusinessCategoryResponse,
} from '../../models/business-entity/business-entity.models';

@Injectable({
  providedIn: 'root',
})
export class BusinessEntityService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBusinessEntityTypes(): Observable<BusinessEntityTypesResponse> {
    return this.http.get<BusinessEntityTypesResponse>(
      `${this.apiUrl}/BusinessEntity/types`
    );
  }

  getBusinessEntity(): Observable<BusinessEntityResponse> {
    return this.http.get<BusinessEntityResponse>(
      `${this.apiUrl}/BusinessEntity`
    );
  }

  saveBusinessEntity(
    data: SaveBusinessEntityRequest
  ): Observable<SaveBusinessEntityResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<SaveBusinessEntityResponse>(
      `${this.apiUrl}/BusinessEntity/save`,
      data,
      { headers }
    );
  }

  getBusinessCategories(): Observable<BusinessCategoriesResponse> {
    return this.http.get<BusinessCategoriesResponse>(
      `${this.apiUrl}/BusinessCategory/categories`
    );
  }

  getBusinessCategory(): Observable<BusinessCategoryResponse> {
    return this.http.get<BusinessCategoryResponse>(
      `${this.apiUrl}/BusinessCategory`
    );
  }

  saveBusinessCategory(
    data: SaveBusinessCategoryRequest
  ): Observable<SaveBusinessCategoryResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<SaveBusinessCategoryResponse>(
      `${this.apiUrl}/BusinessCategory/save`,
      data,
      { headers }
    );
  }
}
