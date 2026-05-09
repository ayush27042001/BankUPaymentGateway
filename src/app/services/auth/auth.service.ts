import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private loginService = inject(LoginService);
  private isRefreshing = false;
  private refreshTokenSubject: any = null;

  private readonly TOKEN_KEY = 'authToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly TOKEN_EXPIRATION_KEY = 'tokenExpiration';
  private readonly REFRESH_TOKEN_EXPIRATION_KEY = 'refreshTokenExpiration';
  private readonly USER_ID_KEY = 'userId';
  private readonly MID_KEY = 'mid';
  private readonly USER_DATA_KEY = 'userData';
  private readonly REGISTRATION_TOKEN_KEY = 'registrationToken';
  private readonly ONBOARDING_STATUS_KEY = 'onboardingStatus';
  private readonly IS_ONBOARDING_COMPLETED_KEY = 'isOnboardingCompleted';
  private readonly IS_SERVICE_AGREEMENT_SUBMITTED_KEY = 'isServiceAgreementSubmitted';
  private readonly IS_ONBOARDING_REJECTED_KEY = 'isOnboardingRejected';

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  setAuthData(
    token: string,
    userId: string,
    mid: string,
    userData?: any,
    refreshToken?: string,
    tokenExpiration?: string,
    refreshTokenExpiration?: string,
    onboardingStatus?: any,
    isOnboardingCompleted?: boolean,
    isServiceAgreementSubmitted?: boolean,
    isOnboardingRejected?: boolean
  ): void {
    try {
      console.log('setAuthData - Storing auth data...');
      console.log('setAuthData - token:', token ? 'present' : 'missing');
      console.log('setAuthData - userId:', userId);
      console.log('setAuthData - mid:', mid);
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_ID_KEY, userId);
      localStorage.setItem(this.MID_KEY, mid);
      if (userData) {
        localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
      }
      if (refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      }
      if (tokenExpiration) {
        localStorage.setItem(this.TOKEN_EXPIRATION_KEY, tokenExpiration);
      }
      if (refreshTokenExpiration) {
        localStorage.setItem(this.REFRESH_TOKEN_EXPIRATION_KEY, refreshTokenExpiration);
      }
      if (onboardingStatus) {
        localStorage.setItem(this.ONBOARDING_STATUS_KEY, JSON.stringify(onboardingStatus));
      }
      if (isOnboardingCompleted !== undefined) {
        localStorage.setItem(this.IS_ONBOARDING_COMPLETED_KEY, JSON.stringify(isOnboardingCompleted));
      }
      if (isServiceAgreementSubmitted !== undefined) {
        localStorage.setItem(this.IS_SERVICE_AGREEMENT_SUBMITTED_KEY, JSON.stringify(isServiceAgreementSubmitted));
      }
      if (isOnboardingRejected !== undefined) {
        localStorage.setItem(this.IS_ONBOARDING_REJECTED_KEY, JSON.stringify(isOnboardingRejected));
      }
      console.log('setAuthData - Data stored successfully');
    } catch (e) {
      console.error('Failed to store auth data:', e);
    }
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserId(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.USER_ID_KEY);
  }

  getMid(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.MID_KEY);
  }

  getUserData(): any {
    if (!this.isBrowser()) return null;
    const userData = localStorage.getItem(this.USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getTokenExpiration(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.TOKEN_EXPIRATION_KEY);
  }

  getRefreshTokenExpiration(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.REFRESH_TOKEN_EXPIRATION_KEY);
  }

  getOnboardingStatus(): any {
    if (!this.isBrowser()) return null;
    const onboardingStatus = localStorage.getItem(this.ONBOARDING_STATUS_KEY);
    return onboardingStatus ? JSON.parse(onboardingStatus) : null;
  }

  isOnboardingCompleted(): boolean {
    if (!this.isBrowser()) return false;
    const isCompleted = localStorage.getItem(this.IS_ONBOARDING_COMPLETED_KEY);
    return isCompleted ? JSON.parse(isCompleted) : false;
  }

  isServiceAgreementSubmitted(): boolean {
    if (!this.isBrowser()) return false;
    const isSubmitted = localStorage.getItem(this.IS_SERVICE_AGREEMENT_SUBMITTED_KEY);
    return isSubmitted ? JSON.parse(isSubmitted) : false;
  }

  isOnboardingRejected(): boolean {
    if (!this.isBrowser()) return false;
    const isRejected = localStorage.getItem(this.IS_ONBOARDING_REJECTED_KEY);
    return isRejected ? JSON.parse(isRejected) : false;
  }

  isTokenExpired(): boolean {
    const expiration = this.getTokenExpiration();
    if (!expiration) return true;
    return new Date(expiration) <= new Date();
  }

  isRefreshTokenExpired(): boolean {
    const expiration = this.getRefreshTokenExpiration();
    if (!expiration) return true;
    return new Date(expiration) <= new Date();
  }

  setRegistrationToken(token: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.REGISTRATION_TOKEN_KEY, token);
  }

  getRegistrationToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.REGISTRATION_TOKEN_KEY);
  }

  clearRegistrationToken(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(this.REGISTRATION_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser()) return false;
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const userId = localStorage.getItem(this.USER_ID_KEY);
      const mid = localStorage.getItem(this.MID_KEY);
      console.log('isAuthenticated - token:', !!token);
      console.log('isAuthenticated - userId:', !!userId);
      console.log('isAuthenticated - mid:', !!mid);
      return !!token && !!userId && !!mid;
    } catch {
      return false;
    }
  }

  logout(): void {
    if (!this.isBrowser()) {
      this.router.navigate(['/login']);
      return;
    }
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRATION_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_EXPIRATION_KEY);
    localStorage.removeItem(this.USER_ID_KEY);
    localStorage.removeItem(this.MID_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    localStorage.removeItem(this.REGISTRATION_TOKEN_KEY);
    localStorage.removeItem(this.ONBOARDING_STATUS_KEY);
    localStorage.removeItem(this.IS_ONBOARDING_COMPLETED_KEY);
    localStorage.removeItem(this.IS_SERVICE_AGREEMENT_SUBMITTED_KEY);
    localStorage.removeItem(this.IS_ONBOARDING_REJECTED_KEY);
    this.router.navigate(['/login']);
  }

  clearAuth(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRATION_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_EXPIRATION_KEY);
    localStorage.removeItem(this.USER_ID_KEY);
    localStorage.removeItem(this.MID_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    localStorage.removeItem(this.REGISTRATION_TOKEN_KEY);
    localStorage.removeItem(this.ONBOARDING_STATUS_KEY);
    localStorage.removeItem(this.IS_ONBOARDING_COMPLETED_KEY);
    localStorage.removeItem(this.IS_SERVICE_AGREEMENT_SUBMITTED_KEY);
    localStorage.removeItem(this.IS_ONBOARDING_REJECTED_KEY);
  }

  getActiveRouteBasedOnOnboarding(): string {
    // Check if onboarding is rejected
    if (this.isOnboardingRejected()) {
      return '/onboarding-rejected';
    }

    // Check if service agreement is submitted but onboarding is not completed
    if (this.isServiceAgreementSubmitted() && !this.isOnboardingCompleted() && !this.isOnboardingRejected()) {
      return '/status-tracker';
    }

    const onboardingStatus = this.getOnboardingStatus();
    if (!onboardingStatus || !onboardingStatus.steps) {
      return '/pan-verification';
    }

    // First, check if CONNECT_PLATFORM has connectPlatformSteps with an active sub-step
    const connectPlatformStep = onboardingStatus.steps.find((step: any) => step.stepKey === 'CONNECT_PLATFORM');
    if (connectPlatformStep && connectPlatformStep.connectPlatformSteps) {
      const activeSubStep = connectPlatformStep.connectPlatformSteps.steps.find((subStep: any) => subStep.isActive);
      if (activeSubStep) {
        const subStepRouteMap: { [key: string]: string } = {
          'CONNECT_MOBILE_APP_OR_WEBSITE': '/connect-platform',
          'SHARE_BANK_ACCOUNT_DETAILS': '/connect-platform',
          'SIGNING_AUTHORITY_DETAILS': '/connect-platform',
          'VERIFY_BUSINESS_ADDRESS': '/connect-platform',
          'COMPLETE_VIDEO_KYC': '/connect-platform',
          'SERVICE_AGREEMENT': '/connect-platform',
        };
        return subStepRouteMap[activeSubStep.stepKey] || '/connect-platform';
      }
    }

    // If no CONNECT_PLATFORM sub-step is active, check for an active outer step
    const activeStep = onboardingStatus.steps.find((step: any) => step.isActive);
    if (!activeStep) {
      return '/pan-verification';
    }

    const stepRouteMap: { [key: string]: string } = {
      'ACCOUNT_CREATION': '/pan-verification',
      'PAN_VERIFICATION': '/pan-verification',
      'BUSINESS_ENTITY': '/business-entity',
      'PHONE_CKYC': '/phone-ckyc',
      'BUSINESS_CATEGORY': '/business-category',
      'SHARE_BUSINESS_DETAILS': '/share-business-details',
      'CONNECT_PLATFORM': '/connect-platform',
      'UPLOAD_DOCUMENTS': '/connect-platform',
      'SERVICE_AGREEMENT': '/connect-platform',
    };

    return stepRouteMap[activeStep.stepKey] || '/pan-verification';
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    const expiredToken = this.getToken();

    if (!refreshToken || !expiredToken) {
      this.logout();
      return new Observable(observer => {
        observer.error('No refresh token or expired token available');
      });
    }

    return this.loginService.refreshToken({
      refreshToken,
      expiredToken
    });
  }

  updateTokens(token: string, refreshToken: string, tokenExpiration: string, refreshTokenExpiration: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.TOKEN_EXPIRATION_KEY, tokenExpiration);
    localStorage.setItem(this.REFRESH_TOKEN_EXPIRATION_KEY, refreshTokenExpiration);
  }
}
