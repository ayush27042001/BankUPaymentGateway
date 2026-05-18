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
  styleUrls: ['./users.scss'],
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

    mobileNumber: '',

    panNumber: '',

    panName: '',

    businessType: '',

    businessCategory: '',

    gstin: '',

    annualSales: '',

    bankHolderName: '',

    bankAccountNumber: '',

    ifscCode: '',

    bankName: '',

    state: '',

    city: '',

    pincode: '',

    businessAddress: '',

  };

  /* =========================================
     USERS DATA
  ========================================= */

  users = [

    {

      userId: 1,

      email: 'ayushawasthi731@gmail.com',

      mobileNumber: '9935144983',

      panNumber: 'CMHPA4444B',

      panName: 'AYUSH KUMAR AWASTHI',

      panDob: '20 Sep 2001',

      businessType: 'Sole Proprietorship',

      businessCategory: 'Gifts & Novelties',

      gstin: '29ABCDE1234F1Z5',

      annualSales: '₹ 10,00,000',

      bankHolderName: 'AYUSH AWASTHI',

      bankAccountNumber: 'XXXXXX9765',

      ifscCode: 'SBIN0004587',

      bankName: 'State Bank of India',

      state: 'Delhi',

      city: 'New Delhi',

      pincode: '110001',

      businessAddress: 'Karol Bagh, New Delhi',

      isKycVerified: true,

      isActive: true,

      lastLoginDate: '11 May 2026',

      createdDate: '01 May 2026',

      updatedDate: '11 May 2026',

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

          ||

          user.panNumber
            ?.toLowerCase()
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

      mobileNumber: '',

      panNumber: '',

      panName: '',

      businessType: '',

      businessCategory: '',

      gstin: '',

      annualSales: '',

      bankHolderName: '',

      bankAccountNumber: '',

      ifscCode: '',

      bankName: '',

      state: '',

      city: '',

      pincode: '',

      businessAddress: '',

    };

  }

  trackByUserId(_: number, user: any): number {
    return user.userId;
  }

  exportUsers(): void {
    const headers = [
      'User ID',
      'Email',
      'Mobile Number',
      'PAN Number',
      'PAN Name',
      'Business Type',
      'GSTIN',
      'Bank Name',
      'Bank Account',
      'Business Category',
      'KYC Status',
      'Account Status',
      'Last Login',
    ];

    const rows = this.filteredUsers().map((user: any) => [
      user.userId,
      user.email,
      user.mobileNumber,
      user.panNumber,
      user.panName,
      user.businessType,
      user.gstin,
      user.bankName,
      user.bankAccountNumber,
      user.businessCategory,
      user.isKycVerified ? 'Verified' : 'Pending',
      user.isActive ? 'Active' : 'Inactive',
      user.lastLoginDate || '—',
    ]);

    this.downloadCsv(headers, rows);
  }

  private downloadCsv(headers: string[], rows: any[][]): void {
    const csvLines = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ];

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  approveUser(): void {
    if (!this.selectedUser) {
      return;
    }

    this.selectedUser.isKycVerified = true;
    this.selectedUser.isActive = true;
  }

  rejectUser(): void {
    if (!this.selectedUser) {
      return;
    }

    this.selectedUser.isKycVerified = false;
  }

  addUser(): void {
    const nextId = this.users.length
      ? Math.max(...this.users.map((user: any) => user.userId)) + 1
      : 1;

    const newUser = {
      userId: nextId,
      email: this.newUser.email,
      mobileNumber: this.newUser.mobileNumber,
      panNumber: this.newUser.panNumber,
      panName: this.newUser.panName || '-',
      panDob: '—',
      businessType: this.newUser.businessType,
      businessCategory: this.newUser.businessCategory,
      gstin: this.newUser.gstin,
      annualSales: this.newUser.annualSales || '—',
      bankHolderName: this.newUser.bankHolderName || '-',
      bankAccountNumber: this.newUser.bankAccountNumber || '-',
      ifscCode: this.newUser.ifscCode || '-',
      bankName: this.newUser.bankName || '-',
      state: this.newUser.state || '-',
      city: this.newUser.city || '-',
      pincode: this.newUser.pincode || '-',
      businessAddress: this.newUser.businessAddress || '-',
      isKycVerified: false,
      isActive: true,
      lastLoginDate: '—',
      createdDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      updatedDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };

    this.users.unshift(newUser);
    this.closeAddModal();
  }

  private getMaskedValue(value: any): string {
    if (!value) {
      return '—';
    }

    return value.toString().replace(/.(?=.{4})/g, '*');
  }

}