import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/* =========================================
   REQUEST MODEL
========================================= */

export interface CreateUserRequest {
  email: string;
  password: string;
  mobileNumber: string;
}

/* =========================================
   RESPONSE DATA MODEL
========================================= */

export interface User {
  userId: number;
  email: string;
  mobileNumber: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isActive: boolean;
  isLocked: boolean;
  failedLoginAttempts: number;
  lastLoginDate: string | null;
  passwordLastChangedDate: string | null;
  createdDate: string | null;
  updatedDate: string | null;
}

/* =========================================
   API RESPONSE MODELS
========================================= */

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
  errors: string[];
  timestamp: string;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: {
    items: User[];
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
export class UsersService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  createUser(
    data: CreateUserRequest
  ): Observable<UserResponse> {

    return this.http.post<UserResponse>(
      `${this.apiUrl}/UserMaster`,
      data,
      { headers: this.headers }
    );

  }

  getUserById(
    userId: number
  ): Observable<UserResponse> {

    return this.http.get<UserResponse>(
      `${this.apiUrl}/UserMaster/${userId}`,
      { headers: this.headers }
    );

  }

  getUserList(
    pageNumber: number,
    pageSize: number,
    search: string = ''
  ): Observable<UserListResponse> {

    let url =
      `${this.apiUrl}/UserMaster/list?PageNumber=${pageNumber}&PageSize=${pageSize}&Search=${search}`;

    return this.http.get<UserListResponse>(
      url,
      { headers: this.headers }
    );

  }

}
