import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HorizontalTableScrollDirective } from '../../../shared/directives/horizontal-table-scroll.directive';
import { ToastrService } from 'ngx-toastr';
import { UsersService, User, CreateUserRequest } from '../../services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HorizontalTableScrollDirective
  ],
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
})
export class Users {

  private usersService = inject(UsersService);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  /* =========================================
     SEARCH
  ========================================= */

  searchText: string = '';

  /* =========================================
     PAGINATION
  ========================================= */

  currentPage: number = 1;

  pageSize: number = 5;

  totalCount: number = 0;

  totalPages: number = 0;

  hasNextPage: boolean = false;

  hasPreviousPage: boolean = false;

  /* =========================================
     MODALS
  ========================================= */

  isViewModalOpen: boolean = false;

  isAddModalOpen: boolean = false;

  /* =========================================
     USERS DATA
  ========================================= */

  users: User[] = [];

  /* =========================================
     SELECTED USER
  ========================================= */

  selectedUser: User | null = null;

  /* =========================================
     NEW USER
  ========================================= */

  newUser: CreateUserRequest = {
    email: '',
    password: '',
    mobileNumber: '',
  };

  /* =========================================
     ON INIT — LOAD USERS
  ========================================= */

  ngOnInit(): void {
    this.loadUsers();
  }

  /* =========================================
     LOAD USERS FROM API
  ========================================= */

  loadUsers(): void {

    this.usersService.getUserList(
      this.currentPage,
      this.pageSize,
      this.searchText
    ).subscribe({
      next: (response) => {

        if (response.success) {
          this.users = response.data.items;
          this.totalCount = response.data.totalCount;
          this.totalPages = response.data.totalPages;
          this.hasNextPage = response.data.hasNextPage;
          this.hasPreviousPage = response.data.hasPreviousPage;
        } else {
          this.toastr.error(
            response.message || 'Failed to load users',
            'Error'
          );
        }

        this.cdr.detectChanges();
      },
      error: (error) => {
        this.toastr.error(
          'Failed to load users',
          'Error'
        );
        console.error('Load users error:', error);
      }
    });

  }

  /* =========================================
     FILTER USERS (SERVER-SIDE SEARCH)
  ========================================= */

  filterUsers(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  /* =========================================
     NEXT PAGE
  ========================================= */

  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  /* =========================================
     PREVIOUS PAGE
  ========================================= */

  previousPage(): void {
    if (this.hasPreviousPage) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  /* =========================================
     OPEN VIEW MODAL
  ========================================= */

  openViewModal(user: User): void {

    this.usersService.getUserById(user.userId).subscribe({
      next: (response) => {

        if (response.success) {
          this.selectedUser = response.data;
          this.isViewModalOpen = true;
          document.body.style.overflow = 'hidden';
        } else {
          this.toastr.error(
            response.message || 'Failed to load user details',
            'Error'
          );
        }

        this.cdr.detectChanges();
      },
      error: (error) => {
        this.toastr.error(
          'Failed to load user details',
          'Error'
        );
        console.error('Get user error:', error);
      }
    });

  }

  /* =========================================
     CLOSE VIEW MODAL
  ========================================= */

  closeViewModal(): void {
    this.selectedUser = null;
    this.isViewModalOpen = false;
    document.body.style.overflow = 'auto';
    this.cdr.detectChanges();
  }

  /* =========================================
     OPEN ADD MODAL
  ========================================= */

  openAddModal(): void {
    this.isAddModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  /* =========================================
     CLOSE ADD MODAL
  ========================================= */

  closeAddModal(): void {
    this.isAddModalOpen = false;
    document.body.style.overflow = 'auto';
    this.resetForm();
    this.cdr.detectChanges();
  }

  /* =========================================
     RESET FORM
  ========================================= */

  resetForm(): void {
    this.newUser = {
      email: '',
      password: '',
      mobileNumber: '',
    };
  }

  /* =========================================
     ADD USER (API CALL)
  ========================================= */

  addUser(): void {

    if (
      !this.newUser.email ||
      !this.newUser.password ||
      !this.newUser.mobileNumber
    ) {
      this.toastr.warning(
        'Please fill all required fields',
        'Validation'
      );
      return;
    }

    this.usersService.createUser(this.newUser).subscribe({
      next: (response) => {

        if (response.success) {
          this.toastr.success(
            response.message || 'User created successfully',
            'Success'
          );
          this.closeAddModal();
          this.loadUsers();
        } else {
          this.toastr.error(
            response.message || 'Failed to create user',
            'Error'
          );
        }

      },
      error: (error) => {
        this.toastr.error(
          'Failed to create user',
          'Error'
        );
        console.error('Create user error:', error);
      }
    });

  }

  /* =========================================
     EXPORT CSV
  ========================================= */

  exportUsers(): void {
    const headers = [
      'User ID',
      'Email',
      'Mobile Number',
      'Email Verified',
      'Mobile Verified',
      'Active',
      'Locked',
      'Failed Login Attempts',
      'Last Login',
      'Created Date',
      'Updated Date',
    ];

    const rows = this.users.map((user: User) => [
      user.userId,
      user.email,
      user.mobileNumber,
      user.isEmailVerified ? 'Yes' : 'No',
      user.isMobileVerified ? 'Yes' : 'No',
      user.isActive ? 'Active' : 'Inactive',
      user.isLocked ? 'Locked' : 'Unlocked',
      user.failedLoginAttempts,
      user.lastLoginDate || '—',
      user.createdDate || '—',
      user.updatedDate || '—',
    ]);

    this.downloadCsv(headers, rows);
  }

  private downloadCsv(headers: string[], rows: any[][]): void {
    const csvLines = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ];

    const blob = new Blob(
      [csvLines.join('\n')],
      { type: 'text/csv;charset=utf-8;' }
    );
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

}
