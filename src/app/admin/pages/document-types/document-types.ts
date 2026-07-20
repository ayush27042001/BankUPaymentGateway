import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HorizontalTableScrollDirective } from '../../../shared/directives/horizontal-table-scroll.directive';
import {
  DocumentTypesService,
  AddDocumentTypeRequest,
  UpdateDocumentTypeRequest
} from '../../services/document-types.service';

@Component({
  selector: 'app-document-types',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HorizontalTableScrollDirective
  ],
  templateUrl: './document-types.html',
  styleUrl: './document-types.scss',
})
export class DocumentTypes implements OnInit {

  private documentTypesService = inject(DocumentTypesService);
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

  selectedDocumentType: any = null;

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
     NEW DOCUMENT TYPE MODEL
  ========================================= */

  newDocumentType = {

    documentName: '',

    documentCode: '',

    allowedExtensions: '',

    maxFileSizeMb: null,

    isRequired: true,

    isActive: true,

  };

  /* =========================================
     DOCUMENT TYPES DATA
  ========================================= */

  documentTypes: any[] = [];

  paginatedData: any[] = [];

  /* =========================================
     INIT
  ========================================= */

  ngOnInit(): void {

    this.loadDocumentTypes();

  }

  /* =========================================
     LOAD DOCUMENT TYPES
  ========================================= */

  loadDocumentTypes(
    pageNumber: number = this.currentPage,
    pageSize: number = this.itemsPerPage,
    search: string = this.searchTerm
  ): void {

    this.documentTypesService
      .getDocumentTypesList(
        pageNumber,
        pageSize,
        search
      )
      .subscribe({

        next: (response: any) => {

          if (response.success) {

            this.documentTypes =
              response.data.items.map((item: any) => ({

                documentTypeId: item.documentTypeId,

                documentName: item.documentName,

                documentCode: item.documentCode,

                allowedExtensions: item.allowedExtensions,

                maxFileSizeMb: item.maxFileSizeMb,

                isRequired: item.isRequired,

                isActive: item.isActive,

                createdDate: item.createdDate,

                updatedDate: item.updatedDate

              }));

            this.paginatedData = [
              ...this.documentTypes
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
            'Failed to load Document Types.',
            'Error'
          );

        }

      });

  }

  /* =========================================
     FILTER DOCUMENT TYPES
  ========================================= */

  filterDocumentTypes(): void {

    this.currentPage = 1;

    this.loadDocumentTypes(
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

      this.loadDocumentTypes(
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

      this.loadDocumentTypes(
        this.currentPage - 1,
        this.itemsPerPage,
        this.searchTerm
      );

    }

  }

  /* =========================================
     OPEN VIEW MODAL
  ========================================= */

  openViewModal(doc: any): void {

    this.documentTypesService
      .getDocumentTypeById(doc.documentTypeId)
      .subscribe({

        next: (response: any) => {

          if (response.success) {

            this.selectedDocumentType = response.data;

            this.showViewModal = true;

            window.document.body.style.overflow = 'hidden';

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

    this.selectedDocumentType = null;

    window.document.body.style.overflow = 'auto';

  }

  /* =========================================
     OPEN ADD MODAL
  ========================================= */

  openAddModal(): void {

    this.showAddModal = true;

    window.document.body.style.overflow = 'hidden';

  }

  /* =========================================
     CLOSE ADD MODAL
  ========================================= */

  closeAddModal(): void {

    this.showAddModal = false;

    window.document.body.style.overflow = 'auto';

    this.resetForm();

    this.cdr.detectChanges();

  }

  /* =========================================
     RESET FORM
  ========================================= */

  resetForm(): void {

    this.newDocumentType = {

      documentName: '',

      documentCode: '',

      allowedExtensions: '',

      maxFileSizeMb: null,

      isRequired: true,

      isActive: true,

    };

  }

  /* =========================================
     ADD DOCUMENT TYPE
  ========================================= */

  addDocumentType(): void {

    if (
      !this.newDocumentType.documentName.trim()

      ||

      !this.newDocumentType.documentCode.trim()

      ||

      !this.newDocumentType.allowedExtensions.trim()

      ||

      !this.newDocumentType.maxFileSizeMb
    ) {

      this.toastr.warning(
        'Please fill all required fields.',
        'Validation'
      );

      return;

    }

    const request: AddDocumentTypeRequest = {

      documentName: this.newDocumentType.documentName,

      documentCode: this.newDocumentType.documentCode,

      allowedExtensions: this.newDocumentType.allowedExtensions,

      maxFileSizeMb: this.newDocumentType.maxFileSizeMb!,

      isRequired: this.newDocumentType.isRequired

    };

    this.documentTypesService
      .addDocumentType(request)
      .subscribe({

        next: (response: any) => {

          if (response.success) {

            this.toastr.success(
              response.message,
              'Success'
            );

            this.resetForm();
            this.closeAddModal();
            this.loadDocumentTypes();

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
     APPROVE DOCUMENT TYPE
  ========================================= */

  approveDocumentType(): void {

    if (!this.selectedDocumentType) {
      return;
    }

    this.selectedDocumentType.isActive = true;

    this.loadDocumentTypes();

    this.closeViewModal();

  }

  /* =========================================
     REJECT DOCUMENT TYPE
  ========================================= */

  rejectDocumentType(): void {

    if (!this.selectedDocumentType) {
      return;
    }

    this.selectedDocumentType.isActive = false;

    this.loadDocumentTypes();

    this.closeViewModal();

  }

  /* =========================================
     EXPORT CSV
  ========================================= */

  exportCSV(): void {

    const headers = [

      'ID',

      'Document Name',

      'Document Code',

      'Allowed Extensions',

      'Max File Size',

      'Required',

      'Status',

      'Created Date',

      'Updated Date'

    ];

    const rows =
      this.documentTypes.map(
        (document) => [

          document.documentTypeId,

          document.documentName,

          document.documentCode,

          document.allowedExtensions,

          document.maxFileSizeMb + ' MB',

          document.isRequired
            ? 'Required'
            : 'Optional',

          document.isActive
            ? 'Active'
            : 'Inactive',

          document.createdDate,

          document.updatedDate

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
      'document-types.csv'
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

  editDocumentType: any = {
    documentTypeId: 0,
    documentName: '',
    documentCode: '',
    allowedExtensions: '',
    maxFileSizeMb: null,
    isRequired: true,
    isActive: true,
    createdDate: '',
    updatedDate: ''
  };

  /* =========================================
     OPEN EDIT MODAL
  ========================================= */

  openEditModal(docType: any): void {

    this.editDocumentType = {
      ...docType
    };

    this.showEditModal = true;

    window.document.body.style.overflow = 'hidden';

  }

  /* =========================================
     CLOSE EDIT MODAL
  ========================================= */

  closeEditModal(): void {

    this.showEditModal = false;

    window.document.body.style.overflow = 'auto';

    this.cdr.detectChanges();

  }

  /* =========================================
     UPDATE DOCUMENT TYPE
  ========================================= */

  updateDocumentType(): void {

    if (
      !this.editDocumentType.documentName.trim()
      ||
      !this.editDocumentType.documentCode.trim()
      ||
      !this.editDocumentType.allowedExtensions.trim()
    ) {

      this.toastr.warning(
        'Please fill all required fields.',
        'Validation'
      );

      return;

    }

    const request: UpdateDocumentTypeRequest = {

      documentTypeId: this.editDocumentType.documentTypeId,

      documentName: this.editDocumentType.documentName,

      documentCode: this.editDocumentType.documentCode,

      allowedExtensions: this.editDocumentType.allowedExtensions,

      maxFileSizeMb: this.editDocumentType.maxFileSizeMb,

      isRequired: this.editDocumentType.isRequired,

      isActive: this.editDocumentType.isActive

    };

    this.documentTypesService
      .updateDocumentType(request)
      .subscribe({

        next: (response: any) => {

          if (response.success) {

            this.toastr.success(
              response.message,
              'Success'
            );

            this.closeEditModal();
            this.loadDocumentTypes();

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
