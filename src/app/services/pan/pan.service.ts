import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import {
  CompletePanRequest,
  CompletePanResponse,
  PanDetailsResponse,
} from '../../models/pan/pan.models';

@Injectable({
  providedIn: 'root',
})
export class PanService {
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

  completePan(data: CompletePanRequest): Observable<CompletePanResponse> {
    return this.http.post<CompletePanResponse>(
      `${this.apiUrl}/Registration/complete-pan`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  getPanDetails(): Observable<PanDetailsResponse> {
    return this.http.get<PanDetailsResponse>(
      `${this.apiUrl}/Registration/get-pan-details`,
      { headers: this.getAuthHeaders() }
    );
  }
}
