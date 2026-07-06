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

  get paginatedProofTypes() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProofTypes.slice(startIndex, endIndex);
  }

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
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /* =========================================
     FILTER PROOF TYPES
  ========================================= */

  filterProofTypes(): void {

    const search =
      this.searchTerm
        .toLowerCase()
        .trim();

    this.currentPage = 1;

    if (!search) {

      this.filteredProofTypes = [
        ...this.businessProofTypes
      ];

      return;

    }

    this.filteredProofTypes =
      this.businessProofTypes.filter((proof) => {

        return (

          proof.businessProofTypeID
            .toString()
            .includes(search)

          ||

          proof.proofName
            .toLowerCase()
            .includes(search)

          ||

          proof.proofCode
            .toLowerCase()
            .includes(search)

          ||

          proof.description
            .toLowerCase()
            .includes(search)

          ||

          (
            proof.isActive
              ? 'active'
              : 'inactive'
          ).includes(search)

        );

      });

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

  document.body.style.overflow = 'auto';

}
loadBusinessProofTypes(): void {

  this.businessProofTypeService
    .getBusinessProofTypes()
    .subscribe({

      next: (response: any) => {

        if (response.success) {

          this.businessProofTypes =
            response.data.map((item: any) => ({

              businessProofTypeID: item.businessProofTypeId,

              proofName: item.proofName,

              proofCode: item.proofCode,

              description: item.description,

              isActive: item.isActive,

              createdDate: item.createdDate,

              updatedDate: item.updatedDate

            }));

          this.filteredProofTypes = [
            ...this.businessProofTypes
          ];

        }

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

          this.closeEditModal();

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