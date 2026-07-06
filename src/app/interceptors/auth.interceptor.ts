import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, catchError, switchMap, from, tap } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { SuperAdminAuthService } from '../admin/services/superadmin-auth.service';
import { ToastService } from '../services/toast/toast.service';

export const authInterceptor = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const superAdminAuthService = inject(SuperAdminAuthService);
  const toastService = inject(ToastService);

  // Skip token for admin auth endpoints
  if (isAdminAuthEndpoint(request.url)) {
    return next(request).pipe(
      tap({
        next: (event) => {
          if (event.type === 4) { // HttpEventType.Response
            const body = (event as any).body;
            if (body) {
              handleApiSuccess(body, toastService, request);
            }
          }
        },
        error: (error) => {
          handleApiError(error, toastService, request);
        }
      })
    );
  }

  // Handle admin API endpoints
  if (isAdminEndpoint(request.url)) {
    const adminToken = superAdminAuthService.getAdminToken();
    let adminRequest = request;

    if (adminToken && !superAdminAuthService.isAdminTokenExpired()) {
      adminRequest = addTokenHeader(request, adminToken);
    }

    return next(adminRequest).pipe(
      tap({
        next: (event) => {
          if (event.type === 4) { // HttpEventType.Response
            const body = (event as any).body;
            if (body) {
              handleApiSuccess(body, toastService, adminRequest);
            }
          }
        },
        error: (error) => {
          handleApiError(error, toastService, adminRequest);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if (superAdminAuthService.getAdminRefreshToken()) {
            return handle401AdminError(adminRequest, next, superAdminAuthService);
          }
          superAdminAuthService.logoutAdmin();
          return throwError(() => error);
        }
        return throwError(() => error);
      })
    );
  }

  // Skip token for user auth endpoints
  if (isAuthEndpoint(request.url)) {
    return next(request).pipe(
      tap({
        next: (event) => {
          if (event.type === 4) { // HttpEventType.Response
            const body = (event as any).body;
            if (body) {
              handleApiSuccess(body, toastService, request);
            }
          }
        },
        error: (error) => {
          handleApiError(error, toastService, request);
        }
      })
    );
  }

  const token = authService.getToken();
  

  if (token && !authService.isTokenExpired()) {
    request = addTokenHeader(request, token);
  }

  return next(request).pipe(
    tap({
      next: (event) => {
        if (event.type === 4) { // HttpEventType.Response
          const body = (event as any).body;
          if (body) {
            handleApiSuccess(body, toastService, request);
          }
        }
      },
      error: (error) => {
        handleApiError(error, toastService, request);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (authService.getRefreshToken()) {
          return handle401Error(request, next, authService);
        }
        authService.logout();
        return throwError(() => error);
      }
      return throwError(() => error);
    })
  );
};

function handleApiSuccess(body: any, toastService: ToastService, request: HttpRequest<unknown>): void {
  // Skip toast for GET requests to avoid spam
  if (request.method === 'GET') return;

  // Only show toast if response has success field and message
  if (body?.success && body?.message) {
    // Skip certain endpoints that don't need toast notifications
    const skipEndpoints = ['/Auth/refresh-token', '/Admin/refresh-token', '/Registration/get-pan-details', '/BusinessDetails/validate-gst', '/ConnectPlatform/save', '/BankAccountDetail/save', '/SigningAuthorityDetail/save', '/BusinessAddress/save', 'ServiceAgreement/save', ''];
    if (skipEndpoints.some((endpoint) => request.url.includes(endpoint))) {
      return;
    }
    toastService.success(body.message);
  }
}

function handleApiError(error: any, toastService: ToastService, request: HttpRequest<unknown>): void {
  // 401 is handled by the auth flow (token refresh / logout redirect)
  if (error?.status === 401) return;
  // GET errors are background loads — components handle their own error UI
  if (request.method === 'GET') return;

  const message = error?.error?.message || error?.message || 'An error occurred';
  toastService.error(message);
}

function isAdminEndpoint(url: string): boolean {
  return url.includes('/Admin/');
}

function isAdminAuthEndpoint(url: string): boolean {
  const adminAuthEndpoints = [
    '/Admin/login',
    '/Admin/verify-otp',
    '/Admin/refresh-token',
  ];
  return adminAuthEndpoints.some((endpoint) => url.includes(endpoint));
}

function isAuthEndpoint(url: string): boolean {
  const authEndpoints = [
    '/Auth/login',
    '/Auth/send-otp',
    '/Auth/verify-otp',
    '/Auth/refresh-token',
  ];
  return authEndpoints.some((endpoint) => url.includes(endpoint));
}

function addTokenHeader(
  request: HttpRequest<unknown>,
  token: string
): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  if (authService.isRefreshTokenExpired()) {
    authService.logout();
    return throwError(() => new Error('Refresh token expired'));
  }

  return from(authService.refreshToken()).pipe(
    switchMap((response: any) => {
      if (response.success) {
        authService.updateTokens(
          response.data.token,
          response.data.refreshToken,
          response.data.expiration,
          response.data.refreshTokenExpiration
        );
        request = addTokenHeader(request, response.data.token);
        return next(request);
      } else {
        authService.logout();
        return throwError(() => new Error('Token refresh failed'));
      }
    }),
    catchError((error) => {
      authService.logout();
      return throwError(() => error);
    })
  );
}

function handle401AdminError(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  superAdminAuthService: SuperAdminAuthService
): Observable<HttpEvent<unknown>> {
  if (superAdminAuthService.isAdminRefreshTokenExpired()) {
    superAdminAuthService.logoutAdmin();
    return throwError(() => new Error('Admin refresh token expired'));
  }

  return from(superAdminAuthService.refreshAdminToken()).pipe(
    switchMap((response: any) => {
      if (response.success) {
        superAdminAuthService.updateAdminTokens(
          response.data.token,
          response.data.refreshToken,
          response.data.expiration,
          response.data.refreshTokenExpiration
        );
        request = addTokenHeader(request, response.data.token);
        return next(request);
      } else {
        superAdminAuthService.logoutAdmin();
        return throwError(() => new Error('Admin token refresh failed'));
      }
    }),
    catchError((error) => {
      superAdminAuthService.logoutAdmin();
      return throwError(() => error);
    })
  );
}
