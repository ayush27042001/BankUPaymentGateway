import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HorizontalTableScrollDirective } from '../../../shared/directives/horizontal-table-scroll.directive';
import {
  PepStatusService,
  AddPepStatusRequest,
  UpdatePepStatusRequest
} from '../../services/pep-status.service';

@Component({
  selector: 'app-pep-status',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HorizontalTableScrollDirective
  ],
  templateUrl: './pep-status.html',
  styleUrl: './pep-status.scss',
})
export class PepStatus implements OnInit {

  private pepStatusService = inject(PepStatusService);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  /* =========================================
     SEARCH
  ========================================= */

  searchTerm: string = '';

  /* =========================================
     VIEW MODAL
  ========================================= */

  showViewModal: boolean = false;

  selectedPepStatus: any = null;

  /* =========================================
     ADD MODAL
  ========================================= */

  showAddModal: boolean = false;

  /* =========================================
     PAGINATION
  ========================================= */

  currentPage: number = 1;

  itemsPerPage: number = 5;

  totalCount: number = 0;

  totalPages: number = 0;

  hasPreviousPage: boolean = false;

  hasNextPage: boolean = false;

  /* =========================================
     NEW PEP STATUS MODEL
  ========================================= */

  newPepStatus = {

    statusName: '',

    description: '',

    isActive: true,

  };

  /* =========================================
     PEP STATUS DATA
  ========================================= */

  pepStatusList: any[] = [];

  paginatedData: any[] = [];

  /* =========================================
     INIT
  ========================================= */

  ngOnInit(): void {

    this.loadPepStatusList();

  }

  /* =========================================
     LOAD PEP STATUS LIST
  ========================================= */

  loadPepStatusList(
    pageNumber: number = this.currentPage,
    pageSize: number = this.itemsPerPage,
    search: string = this.searchTerm
  ): void {

    this.pepStatusService
      .getPepStatusList(
        pageNumber,
        pageSize,
        search
      )
      .subscribe({

        next: (response: any) => {

          if (response.success) {

            this.pepStatusList =
              response.data.items.map((item: any) => ({

                pepstatusId: item.pepstatusId,

                statusName: item.statusName,

                description: item.description,

                isActive: item.isActive,

                createdDate: item.createdDate,

                updatedDate: item.updatedDate

              }));

            this.paginatedData = [
              ...this.pepStatusList
            ];

            this.currentPage = response.data.pageNumber;
            this.itemsPerPage = response.data.pageSize;
            this.totalCount = response.data.totalCount;
            this.totalPages = response.data.totalPages;
            this.hasPreviousPage = response.data.hasPreviousPage;
            this.hasNextPage = response.data.hasNextPage;

          }

          this.cdr.markForCheck();

        },

        error: (err: any) => {

          console.error(err);

          this.toastr.error(
            'Failed to load PEP Status.',
            'Error'
          );

        }

      });

  }

  /* =========================================
     FILTER PEP STATUS
  ========================================= */

  filterPepStatus(): void {

    this.currentPage = 1;

    this.loadPepStatusList(
      this.currentPage,
      this.itemsPerPage,
      this.searchTerm
    );

  }

  /* =========================================
     NEXT PAGE
  ========================================= */

  nextPage(): void {

    if (this.hasNextPage) {

      this.loadPepStatusList(
        this.currentPage + 1,
        this.itemsPerPage,
        this.searchTerm
      );

    }

  }

  /* =========================================
     PREVIOUS PAGE
  ========================================= */

  previousPage(): void {

    if (this.hasPreviousPage) {

      this.loadPepStatusList(
        this.currentPage - 1,
        this.itemsPerPage,
        this.searchTerm
      );

    }

  }

  /* =========================================
     OPEN VIEW MODAL
  ========================================= */

  openViewModal(pep: any): void {

    this.pepStatusService
      .getPepStatusById(pep.pepstatusId)
      .subscribe({

        next: (response: any) => {

          if (response.success) {

            this.selectedPepStatus = response.data;

            this.showViewModal = true;

            document.body.style.overflow = 'hidden';

          } else {

            this.toastr.error(
              response.message,
              'Error'
            );

          }

        },

        error: (err: any) => {

          console.error(err);

          const message =
            err?.error?.message ||
            'Something went wrong.';

          this.toastr.error(message, 'Error');

        }

      });

  }

  /* =========================================
     CLOSE VIEW MODAL
  ========================================= */

  closeViewModal(): void {

    this.showViewModal = false;

    this.selectedPepStatus = null;

    document.body.style.overflow = 'auto';

  }

  /* =========================================
     OPEN ADD MODAL
  ========================================= */

  openAddModal(): void {

    this.showAddModal = true;

    document.body.style.overflow = 'hidden';

  }

  /* =========================================
     CLOSE ADD MODAL
  ========================================= */

  closeAddModal(): void {

    this.showAddModal = false;

    document.body.style.overflow = 'auto';

    this.resetForm();

    this.cdr.detectChanges();

  }

  /* =========================================
     RESET FORM
  ========================================= */

  resetForm(): void {

    this.newPepStatus = {

      statusName: '',

      description: '',

      isActive: true,

    };

  }

  /* =========================================
     ADD PEP STATUS
  ========================================= */

  addPepStatus(): void {

    if (
      !this.newPepStatus.statusName.trim()
      ||
      !this.newPepStatus.description.trim()
    ) {

      this.toastr.warning(
        'Please fill all required fields.',
        'Validation'
      );

      return;

    }

    const request: AddPepStatusRequest = {

      statusName: this.newPepStatus.statusName,

      description: this.newPepStatus.description

    };

    this.pepStatusService
      .addPepStatus(request)
      .subscribe({

        next: (response: any) => {

          if (response.success) {

            this.toastr.success(
              response.message,
              'Success'
            );

            this.resetForm();
            this.closeAddModal();
            this.loadPepStatusList();

          } else {

            this.toastr.error(
              response.message,
              'Error'
            );

          }

        },

        error: (error) => {

          console.error(error);

          const message =
            error?.error?.message ||
            'Something went wrong.';

          this.toastr.error(message, 'Error');

        }

      });

  }

  /* =========================================
     APPROVE
  ========================================= */

  approvePepStatus(): void {

    if (!this.selectedPepStatus) {
      return;
    }

    this.selectedPepStatus.isActive = true;

    this.loadPepStatusList();

    this.closeViewModal();

  }

  /* =========================================
     REJECT
  ========================================= */

  rejectPepStatus(): void {

    if (!this.selectedPepStatus) {
      return;
    }

    this.selectedPepStatus.isActive = false;

    this.loadPepStatusList();

    this.closeViewModal();

  }

  /* =========================================
     EXPORT CSV
  ========================================= */

  exportCSV(): void {

    const headers = [

      'ID',

      'Status Name',

      'Description',

      'Status',

      'Created Date',

      'Updated Date'

    ];

    const rows =
      this.pepStatusList.map(
        (pep) => [

          pep.pepstatusId,

          pep.statusName,

          pep.description,

          pep.isActive
            ? 'Active'
            : 'Inactive',

          pep.createdDate,

          pep.updatedDate

        ]
      );

    const csvContent = [

      headers.join(','),

      ...rows.map((row) =>
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
      'pep-status.csv'
    );

    link.style.visibility = 'hidden';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  }

  /* =========================================
     EDIT MODAL
  ========================================= */

  showEditModal: boolean = false;

  editPepStatus: any = {
    pepstatusId: 0,
    statusName: '',
    description: '',
    isActive: true,
    createdDate: '',
    updatedDate: ''
  };

  /* =========================================
     OPEN EDIT MODAL
  ========================================= */

  openEditModal(status: any): void {

    this.editPepStatus = {
      ...status
    };

    this.showEditModal = true;

    document.body.style.overflow = 'hidden';

  }

  /* =========================================
     CLOSE EDIT MODAL
  ========================================= */

  closeEditModal(): void {

    this.showEditModal = false;

    document.body.style.overflow = 'auto';

    this.cdr.detectChanges();

  }

  /* =========================================
     UPDATE PEP STATUS
  ========================================= */

  updatePepStatus(): void {

    if (
      !this.editPepStatus.statusName.trim()
      ||
      !this.editPepStatus.description.trim()
    ) {

      this.toastr.warning(
        'Please fill all required fields.',
        'Validation'
      );

      return;

    }

    const request: UpdatePepStatusRequest = {

      pepstatusId: this.editPepStatus.pepstatusId,

      statusName: this.editPepStatus.statusName,

      description: this.editPepStatus.description,

      isActive: this.editPepStatus.isActive

    };

    this.pepStatusService
      .updatePepStatus(request)
      .subscribe({

        next: (response: any) => {

          if (response.success) {

            this.toastr.success(
              response.message,
              'Success'
            );

            this.closeEditModal();
            this.loadPepStatusList();

          } else {

            this.toastr.error(
              response.message,
              'Error'
            );

          }

        },

        error: (err: any) => {

          console.error(err);

          const message =
            err?.error?.message ||
            'Something went wrong.';

          this.toastr.error(message, 'Error');

        }

      });

  }

}
