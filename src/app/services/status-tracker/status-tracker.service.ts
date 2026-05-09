import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, switchMap, startWith, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StatusStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'approved' | 'rejected';
  icon: string;
  completedDate?: string;
  remarks?: string;
}

export interface OnboardingStatusResponse {
  success: boolean;
  data?: {
    applicationId: string;
    statusSteps: StatusStep[];
    overallProgress: number;
    lastUpdated: string;
  };
  message?: string;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class StatusTrackerService {
  private apiUrl = environment.apiUrl || '/api';
  private statusSubject = new BehaviorSubject<OnboardingStatusResponse | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  status$ = this.statusSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * Fetch onboarding status from API
   */
  getOnboardingStatus(): Observable<OnboardingStatusResponse> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<OnboardingStatusResponse>(
      `${this.apiUrl}/onboarding/status`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError((error) => {
        this.loadingSubject.next(false);
        this.errorSubject.next(this.handleError(error));
        return of({ success: false, message: 'Failed to fetch status' });
      })
    );
  }

  /**
   * Start real-time polling for status updates
   * @param intervalMs Polling interval in milliseconds (default: 30000ms = 30 seconds)
   */
  startRealTimeUpdates(intervalMs: number = 30000): Observable<OnboardingStatusResponse> {
    return interval(intervalMs).pipe(
      startWith(0),
      switchMap(() => this.getOnboardingStatus())
    );
  }

  /**
   * Manually refresh status
   */
  refreshStatus(): Observable<OnboardingStatusResponse> {
    return this.getOnboardingStatus();
  }

  /**
   * Update local status state
   */
  updateStatus(response: OnboardingStatusResponse): void {
    this.statusSubject.next(response);
    this.loadingSubject.next(false);
    this.errorSubject.next(null);
  }

  /**
   * Get current status value
   */
  getCurrentStatus(): OnboardingStatusResponse | null {
    return this.statusSubject.value;
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): string {
    if (error.status === 401) {
      return 'Unauthorized. Please login again.';
    }
    if (error.status === 403) {
      return 'Access denied. You do not have permission to view this status.';
    }
    if (error.status === 404) {
      return 'Application not found. Please contact support.';
    }
    if (error.status >= 500) {
      return 'Server error. Please try again later.';
    }
    return error.error?.message || 'An unexpected error occurred.';
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.errorSubject.next(null);
  }
}
