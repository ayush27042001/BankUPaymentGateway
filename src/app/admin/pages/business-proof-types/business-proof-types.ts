import { CommonModule } from '@angular/common';
import { Component,OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HorizontalTableScrollDirective } from '../../../shared/directives/horizontal-table-scroll.directive';

import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef, inject } from '@angular/core';
import {
  BusinessProofTypeService,
  AddBusinessProofTypeResponse
} from '../../services/business-proof-type.service';
@Component({
  selector: 'app-business-proof-types',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HorizontalTableScrollDirective
  ],
  templateUrl: './business-proof-types.html',
  styleUrl: './business-proof-types.scss',
})
export class BusinessProofTypes implements OnInit {
  ngOnInit(): void {

  this.loadBusinessProofTypes();

}
private businessProofTypeService = inject(BusinessProofTypeService);
private toastr = inject(ToastrService);
private cdr = inject(ChangeDetectorRef);
  /* =========================================
     PAGINATION
  ========================================= */

  currentPage: number = 1;
  itemsPerPage: number = 5;
  // totalPages: number = 0;

totalCount: number = 0;

hasPreviousPage: boolean = false;

hasNextPage: boolean = false;

  /* =========================================
     SEARCH
  ========================================= */

  searchTerm: string = '';

  /* =========================================
     VIEW MODAL
  ========================================= */

  showViewModal: boolean = false;

  selectedProofType: any = null;

  /* =========================================
     ADD MODAL
  ========================================= */

  showAddModal: boolean = false;

  /* =========================================
     NEW PROOF TYPE MODEL
  ========================================= */

  newProofType = {

    proofName: '',

    proofCode: '',

    description: '',

    isActive: true,

  };

  /* =========================================
     PROOF TYPE DATA
  ========================================= */

 businessProofTypes: any[] = [];

  /* =========================================
     FILTERED DATA
  ========================================= */

  filteredProofTypes: any[] = [];

  /* =========================================
     PAGINATED DATA
  ========================================= */


  /* =========================================
     TOTAL PAGES
  ========================================= */

  get totalPages(): number {
    return Math.ceil(this.filteredProofTypes.length / this.itemsPerPage);
  }

  /* =========================================
     PAGINATION CONTROLS
  ========================================= */

 nextPage(): void {

  console.log('Current Page:', this.currentPage);
  console.log('Has Next Page:', this.hasNextPage);

  this.loadBusinessProofTypes(
    this.currentPage + 1,
    this.itemsPerPage,
    this.searchTerm
  );

}

 previousPage(): void {

  if (this.hasPreviousPage) {

    this.loadBusinessProofTypes(
      this.currentPage - 1,
      this.itemsPerPage,
      this.searchTerm
    );

  }

}

  /* =========================================
     FILTER PROOF TYPES
  ========================================= */
filterProofTypes(): void {

  this.currentPage = 1;

  this.loadBusinessProofTypes(
    this.currentPage,
    this.itemsPerPage,
    this.searchTerm
  );

}

  /* =========================================
     OPEN VIEW MODAL
  ========================================= */

 openViewModal(proof: any): void {

  this.businessProofTypeService
    .getBusinessProofTypeById(proof.businessProofTypeID)
    .subscribe({

      next: (response: any) => {

        if (response.success) {

          this.selectedProofType = {

            businessProofTypeID: response.data.businessProofTypeId,

            proofName: response.data.proofName,

            proofCode: response.data.proofCode,

            description: response.data.description,

            isActive: response.data.isActive,

            createdDate: response.data.createdDate,

            updatedDate: response.data.updatedDate

          };

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

        this.toastr.error(
          message,
          'Error'
        );

      }

    });

}

  /* =========================================
     CLOSE VIEW MODAL
  ========================================= */

  closeViewModal(): void {

    this.showViewModal = false;

    this.selectedProofType = null;

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

  this.resetForm();

  document.body.style.overflow = 'auto';

  this.cdr.detectChanges();

}

  /* =========================================
     RESET FORM
  ========================================= */

  resetForm(): void {

    this.newProofType = {

      proofName: '',

      proofCode: '',

      description: '',

      isActive: true,

    };

  }

  /* =========================================
     ADD PROOF TYPE
  ========================================= */

addProofType(): void {

  if (
    !this.newProofType.proofName.trim() ||
    !this.newProofType.proofCode.trim() ||
    !this.newProofType.description.trim()
  ) {

    this.toastr.warning(
      'Please fill all required fields.',
      'Validation'
    );

    return;

  }

  const payload = {

    proofName: this.newProofType.proofName,

    proofCode: this.newProofType.proofCode.toUpperCase(),

    description: this.newProofType.description

  };

  this.businessProofTypeService
    .addBusinessProofType(payload)
    .subscribe({

      next: (response: any) => {
 console.log('Full Response:', response);
  console.log('Data:', response.data);
        if (response.success) {

         

          this.filteredProofTypes = [
            ...this.businessProofTypes
          ];

          this.closeAddModal();

         this.closeAddModal();

this.toastr.success(
  response.message,
  'Success'
);

this.loadBusinessProofTypes();
        } else {

          this.toastr.error(
            response.message,
            'Error'
          );

        }

      },

      error: (err: any) => {

        console.error(err);

        this.toastr.error(
          'Something went wrong.',
          'Error'
        );

      }

    });

}
  /* =========================================
     APPROVE
  ========================================= */

  approveProofType(): void {

    if (!this.selectedProofType) {
      return;
    }

    this.selectedProofType.isActive = true;

    this.selectedProofType.updatedDate =
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
     REJECT
  ========================================= */

  rejectProofType(): void {

    if (!this.selectedProofType) {
      return;
    }

    this.selectedProofType.isActive = false;

    this.selectedProofType.updatedDate =
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
     EXPORT CSV
  ========================================= */

  exportCSV(): void {

    const headers = [

      'ID',

      'Proof Name',

      'Proof Code',

      'Description',

      'Status',

      'Created Date',

      'Updated Date'

    ];

    const rows =
      this.filteredProofTypes.map(
        (proof) => [

          proof.businessProofTypeID,

          proof.proofName,

          proof.proofCode,

          proof.description,

          proof.isActive
            ? 'Active'
            : 'Inactive',

          proof.createdDate,

          proof.updatedDate

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
      'business-proof-types.csv'
    );

    link.style.visibility = 'hidden';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  }


//   openEditModal(proofType: any): void {
//   console.log('Edit:', proofType);
// }
/* =========================================
   EDIT MODAL
========================================= */

showEditModal: boolean = false;

editProofType: any = {
  businessProofTypeID: 0,
  proofName: '',
  proofCode: '',
  description: '',
  isActive: true,
  createdDate: '',
  updatedDate: ''
};

/* =========================================
   OPEN EDIT MODAL
========================================= */

openEditModal(proofType: any): void {

  this.editProofType = {
    ...proofType
  };

  this.showEditModal = true;

  document.body.style.overflow = 'hidden';

}

/* =========================================
   CLOSE EDIT MODAL
========================================= */

closeEditModal(): void {

  this.showEditModal = false;

  this.editProofType = {
    businessProofTypeID: 0,
    proofName: '',
    proofCode: '',
    description: '',
    isActive: true,
    createdDate: '',
    updatedDate: ''
  };

  document.body.style.overflow = 'auto';

  this.cdr.detectChanges();

}
loadBusinessProofTypes(
  pageNumber: number = this.currentPage,
  pageSize: number = this.itemsPerPage,
  search: string = this.searchTerm,
  isActive: boolean | null = null
): void {

  this.businessProofTypeService
    .getBusinessProofTypesList(
      pageNumber,
      pageSize,
      search,
      isActive
    )
    .subscribe({

      next: (response: any) => {

        if (response.success) {

         this.businessProofTypes =
  response.data.items.map((item: any) => ({

    businessProofTypeID: item.businessProofTypeId,
    proofName: item.proofName,
    proofCode: item.proofCode,
    description: item.description,
    isActive: item.isActive,
    createdDate: item.createdDate,
    updatedDate: item.updatedDate

  }));

this.filteredProofTypes = [...this.businessProofTypes];

this.currentPage = response.data.pageNumber;
this.itemsPerPage = response.data.pageSize;
this.totalCount = response.data.totalCount;
this.hasPreviousPage = response.data.hasPreviousPage;
this.hasNextPage = response.data.hasNextPage;

        }

        this.cdr.markForCheck();

      },

      error: (err: any) => {

        console.error(err);

        this.toastr.error(
          'Failed to load Business Proof Types.',
          'Error'
        );

      }

    });

}
/* =========================================
   UPDATE PROOF TYPE
========================================= */

updateProofType(): void {

  if (
    !this.editProofType.proofName.trim() ||
    !this.editProofType.proofCode.trim() ||
    !this.editProofType.description.trim()
  ) {

    this.toastr.warning(
      'Please fill all required fields.',
      'Validation'
    );

    return;

  }

  const payload = {

    businessProofTypeId: this.editProofType.businessProofTypeID,

    proofName: this.editProofType.proofName,

    proofCode: this.editProofType.proofCode.toUpperCase(),

    description: this.editProofType.description,

    isActive: this.editProofType.isActive

  };

  this.businessProofTypeService
    .updateBusinessProofType(payload)
    .subscribe({

      next: (response: any) => {

        if (response.success) {

          this.toastr.success(
            response.message,
            'Success'
          );

          setTimeout(() => {
            this.closeEditModal();
            this.loadBusinessProofTypes();
            this.cdr.detectChanges();
          }, 0);

        } else {

          this.toastr.error(
            response.message,
            'Error'
          );

        }

      },

      error: (err: any) => {

        const message =
          err?.error?.message ||
          'Something went wrong.';

        this.toastr.error(
          message,
          'Error'
        );

      }

    });

}

}