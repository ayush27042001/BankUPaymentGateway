import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {

  /* =========================================
     SEARCH
  ========================================= */

  searchText: string = '';

  /* =========================================
     PAGINATION
  ========================================= */

  currentPage: number = 1;

  itemsPerPage: number = 5;

  /* =========================================
     MODALS
  ========================================= */

  isViewModalOpen: boolean = false;

  isAddModalOpen: boolean = false;

  /* =========================================
     SELECTED USER
  ========================================= */

  selectedUser: any = null;

  /* =========================================
     NEW USER
  ========================================= */

  newUser: any = {

    email: '',

    passwordHash: '',

    salt: '',

    mobileNumber: '',

  };

  /* =========================================
     USERS DATA
  ========================================= */

  users = [

    {
      userId: 1,
      email: 'ayushawasthi731@gmail.com',
      passwordHash: 'AKKDJSHD889X8U=',
      salt: 'JSHDJSHD99Mw==',
      mobileNumber: '9935144983',
      isEmailVerified: true,
      isMobileVerified: true,
      isActive: true,
      isLocked: false,
      failedLoginAttempts: 0,
      lastLoginDate: '11 May 2026',
      passwordLastChangedDate: '09 May 2026',
      createdDate: '01 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      userId: 2,
      email: 'john@example.com',
      passwordHash: 'HJSGD88HSHD7A=',
      salt: 'QWERTY89XX==',
      mobileNumber: '9876543210',
      isEmailVerified: true,
      isMobileVerified: false,
      isActive: true,
      isLocked: false,
      failedLoginAttempts: 2,
      lastLoginDate: '10 May 2026',
      passwordLastChangedDate: '08 May 2026',
      createdDate: '02 May 2026',
      updatedDate: '10 May 2026',
    },

    {
      userId: 3,
      email: 'demo@example.com',
      passwordHash: 'LKJHGFDSA67=',
      salt: 'ZXCVBNM77==',
      mobileNumber: '9123456789',
      isEmailVerified: false,
      isMobileVerified: true,
      isActive: false,
      isLocked: true,
      failedLoginAttempts: 5,
      lastLoginDate: '—',
      passwordLastChangedDate: '05 May 2026',
      createdDate: '03 May 2026',
      updatedDate: '09 May 2026',
    },

  ];

  /* =========================================
     FILTER USERS
  ========================================= */

  filteredUsers() {

    const search =
      this.searchText
        .toLowerCase()
        .trim();

    if (!search) {
      return this.users;
    }

    return this.users.filter(
      (user: any) => {

        return (

          user.email
            ?.toLowerCase()
            .includes(search)

          ||

          user.mobileNumber
            ?.toLowerCase()
            .includes(search)

          ||

          user.userId
            ?.toString()
            .includes(search)

        );

      }
    );

  }

  /* =========================================
     PAGINATED USERS
  ========================================= */

  paginatedUsers() {

    const startIndex =
      (this.currentPage - 1)
      * this.itemsPerPage;

    const endIndex =
      startIndex + this.itemsPerPage;

    return this.filteredUsers().slice(
      startIndex,
      endIndex
    );

  }

  /* =========================================
     TOTAL PAGES
  ========================================= */

  get totalPages(): number {

    return Math.ceil(
      this.filteredUsers().length
      / this.itemsPerPage
    );

  }

  /* =========================================
     NEXT PAGE
  ========================================= */

  nextPage(): void {

    if (
      this.currentPage
      < this.totalPages
    ) {

      this.currentPage++;

    }

  }

  /* =========================================
     PREVIOUS PAGE
  ========================================= */

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

    }

  }

  /* =========================================
     OPEN VIEW MODAL
  ========================================= */

  openViewModal(user: any): void {

    this.selectedUser = user;

    this.isViewModalOpen = true;

    document.body.style.overflow =
      'hidden';

  }

  /* =========================================
     CLOSE VIEW MODAL
  ========================================= */

  closeViewModal(): void {

    this.selectedUser = null;

    this.isViewModalOpen = false;

    document.body.style.overflow =
      'auto';

  }

  /* =========================================
     OPEN ADD MODAL
  ========================================= */

  openAddModal(): void {

    this.isAddModalOpen = true;

    document.body.style.overflow =
      'hidden';

  }

  /* =========================================
     CLOSE ADD MODAL
  ========================================= */

  closeAddModal(): void {

    this.isAddModalOpen = false;

    document.body.style.overflow =
      'auto';

    this.resetForm();

  }

  /* =========================================
     RESET FORM
  ========================================= */

  resetForm(): void {

    this.newUser = {

      email: '',

      passwordHash: '',

      salt: '',

      mobileNumber: '',

    };

  }

  /* =========================================
     ADD USER
  ========================================= */

  addUser(): void {

    if (

      !this.newUser.email
      ||

      !this.newUser.passwordHash
      ||

      !this.newUser.mobileNumber

    ) {

      alert(
        'Please fill all required fields.'
      );

      return;

    }

    const currentDate =
      new Date().toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }
      );

    const user = {

      userId:
        this.users.length + 1,

      email:
        this.newUser.email,

      passwordHash:
        this.newUser.passwordHash,

      salt:
        this.newUser.salt,

      mobileNumber:
        this.newUser.mobileNumber,

      isEmailVerified: false,

      isMobileVerified: false,

      isActive: true,

      isLocked: false,

      failedLoginAttempts: 0,

      lastLoginDate: '—',

      passwordLastChangedDate:
        currentDate,

      createdDate:
        currentDate,

      updatedDate:
        currentDate,

    };

    this.users.unshift(user);

    this.closeAddModal();

    this.currentPage = 1;

  }

  /* =========================================
     APPROVE USER
  ========================================= */

  approveUser(): void {

    if (!this.selectedUser) {
      return;
    }

    this.selectedUser.isActive = true;

    this.selectedUser.updatedDate =
      new Date().toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }
      );

    this.closeViewModal();

  }

  /* =========================================
     REJECT USER
  ========================================= */

  rejectUser(): void {

    if (!this.selectedUser) {
      return;
    }

    this.selectedUser.isActive = false;

    this.selectedUser.updatedDate =
      new Date().toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }
      );

    this.closeViewModal();

  }

  /* =========================================
     EXPORT USERS CSV
  ========================================= */

  exportUsers(): void {

    const headers = [

      'User ID',

      'Email',

      'Mobile Number',

      'Email Verified',

      'Mobile Verified',

      'Status',

      'Lock Status',

      'Failed Attempts',

      'Last Login',

      'Created Date',

      'Updated Date'

    ];

    const rows =
      this.filteredUsers().map(
        (user: any) => [

          user.userId,

          user.email,

          user.mobileNumber,

          user.isEmailVerified
            ? 'Verified'
            : 'Pending',

          user.isMobileVerified
            ? 'Verified'
            : 'Pending',

          user.isActive
            ? 'Active'
            : 'Inactive',

          user.isLocked
            ? 'Locked'
            : 'Unlocked',

          user.failedLoginAttempts,

          user.lastLoginDate,

          user.createdDate,

          user.updatedDate

        ]
      );

    const csvContent = [

      headers.join(','),

      ...rows.map((row: any) =>
        row.join(',')
      )

    ].join('\n');

    const blob = new Blob(
      [csvContent],
      {
        type: 'text/csv;charset=utf-8;',
      }
    );

    const link =
      document.createElement('a');

    const url =
      URL.createObjectURL(blob);

    link.setAttribute('href', url);

    link.setAttribute(
      'download',
      'users.csv'
    );

    link.style.visibility =
      'hidden';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  }

  /* =========================================
     MASKED VALUE
  ========================================= */

  getMaskedValue(
    value: string
  ): string {

    if (!value) {
      return '—';
    }

    if (value.length <= 4) {
      return '••••';
    }

    return (
      '••••••••'
      +
      value.slice(-4)
    );

  }

}