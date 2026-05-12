import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-document-types',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './document-types.html',
  styleUrl: './document-types.scss',
})
export class DocumentTypes {

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

  /* =========================================
     NEW DOCUMENT TYPE MODEL
  ========================================= */

  newDocumentType = {

    documentName: '',

    documentCode: '',

    allowedExtensions: '',

    maxFileSizeMB: null,

    isRequired: true,

    isActive: true,

  };

  /* =========================================
     DOCUMENT TYPES DATA
  ========================================= */

  documentTypes = [

    {
      documentTypeID: 1,
      documentName: 'Aadhaar Card',
      documentCode: 'AADHAAR',
      allowedExtensions: 'JPG,PNG,PDF',
      maxFileSizeMB: 5,
      isRequired: true,
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      documentTypeID: 2,
      documentName: 'PAN Card',
      documentCode: 'PAN',
      allowedExtensions: 'JPG,PNG,PDF',
      maxFileSizeMB: 5,
      isRequired: true,
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      documentTypeID: 3,
      documentName: 'Photo',
      documentCode: 'PHOTO',
      allowedExtensions: 'JPG,PNG,PDF',
      maxFileSizeMB: 5,
      isRequired: true,
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      documentTypeID: 4,
      documentName: 'Business Proof',
      documentCode: 'BUSINESS_PROOF',
      allowedExtensions: 'JPG,PNG,PDF',
      maxFileSizeMB: 5,
      isRequired: true,
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      documentTypeID: 5,
      documentName:
        'Outlet/Shop GeoTag Photo Front',
      documentCode: 'GEOTAG_FRONT',
      allowedExtensions: 'JPG,PNG,PDF',
      maxFileSizeMB: 5,
      isRequired: true,
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      documentTypeID: 6,
      documentName:
        'Outlet/Shop GeoTag Photo Back',
      documentCode: 'GEOTAG_BACK',
      allowedExtensions: 'JPG,PNG,PDF',
      maxFileSizeMB: 5,
      isRequired: false,
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      documentTypeID: 7,
      documentName: 'Cancel Cheque',
      documentCode: 'CANCEL_CHEQUE',
      allowedExtensions: 'JPG,PNG,PDF',
      maxFileSizeMB: 5,
      isRequired: true,
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      documentTypeID: 8,
      documentName: 'GST Certificate',
      documentCode: 'GST_CERT',
      allowedExtensions: 'JPG,PNG,PDF',
      maxFileSizeMB: 5,
      isRequired: false,
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    }

  ];

  /* =========================================
     FILTERED DOCUMENT TYPES
  ========================================= */

  filteredDocumentTypes = [
    ...this.documentTypes
  ];

  /* =========================================
     PAGINATED DATA
  ========================================= */

  get paginatedData() {

    const startIndex =
      (this.currentPage - 1)
      * this.itemsPerPage;

    const endIndex =
      startIndex + this.itemsPerPage;

    return this.filteredDocumentTypes.slice(
      startIndex,
      endIndex
    );

  }

  /* =========================================
     TOTAL PAGES
  ========================================= */

  get totalPages(): number {

    return Math.ceil(
      this.filteredDocumentTypes.length
      / this.itemsPerPage
    );

  }

  /* =========================================
     NEXT PAGE
  ========================================= */

  nextPage(): void {

    if (this.currentPage < this.totalPages) {

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
     FILTER DOCUMENT TYPES
  ========================================= */

  filterDocumentTypes(): void {

    const search =
      this.searchTerm
        .toLowerCase()
        .trim();

    if (!search) {

      this.filteredDocumentTypes = [
        ...this.documentTypes
      ];

      this.currentPage = 1;

      return;

    }

    this.filteredDocumentTypes =
      this.documentTypes.filter(
        (document) => {

          return (

            document.documentTypeID
              .toString()
              .includes(search)

            ||

            document.documentName
              .toLowerCase()
              .includes(search)

            ||

            document.documentCode
              .toLowerCase()
              .includes(search)

            ||

            (
              document.isActive
                ? 'active'
                : 'inactive'
            ).includes(search)

          );

        }
      );

    this.currentPage = 1;

  }

  /* =========================================
     OPEN VIEW MODAL
  ========================================= */

  openViewModal(
    document: any
  ): void {

    this.selectedDocumentType =
      document;

    this.showViewModal = true;

    document.body.style.overflow =
      'hidden';

  }

  /* =========================================
     CLOSE VIEW MODAL
  ========================================= */

  closeViewModal(): void {

    this.showViewModal = false;

    this.selectedDocumentType = null;

    document.body.style.overflow =
      'auto';

  }

  /* =========================================
     OPEN ADD MODAL
  ========================================= */

  openAddModal(): void {

    this.showAddModal = true;

    document.body.style.overflow =
      'hidden';

  }

  /* =========================================
     CLOSE ADD MODAL
  ========================================= */

  closeAddModal(): void {

    this.showAddModal = false;

    document.body.style.overflow =
      'auto';

    this.resetForm();

  }

  /* =========================================
     RESET FORM
  ========================================= */

  resetForm(): void {

    this.newDocumentType = {

      documentName: '',

      documentCode: '',

      allowedExtensions: '',

      maxFileSizeMB: null,

      isRequired: true,

      isActive: true,

    };

  }

  /* =========================================
     ADD DOCUMENT TYPE
  ========================================= */

  addDocumentType(): void {

    if (
      !this.newDocumentType.documentName
        .trim()

      ||

      !this.newDocumentType.documentCode
        .trim()

      ||

      !this.newDocumentType.allowedExtensions
        .trim()

      ||

      !this.newDocumentType.maxFileSizeMB
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

    const newEntry = {

      documentTypeID:
        this.documentTypes.length + 1,

      documentName:
        this.newDocumentType.documentName,

      documentCode:
        this.newDocumentType.documentCode,

      allowedExtensions:
        this.newDocumentType.allowedExtensions,

      maxFileSizeMB:
        this.newDocumentType.maxFileSizeMB,

      isRequired:
        this.newDocumentType.isRequired,

      isActive:
        this.newDocumentType.isActive,

      createdDate:
        currentDate,

      updatedDate:
        currentDate,

    };

    this.documentTypes.unshift(
      newEntry
    );

    this.filteredDocumentTypes = [
      ...this.documentTypes
    ];

    this.currentPage = 1;

    this.closeAddModal();

  }

  /* =========================================
     APPROVE DOCUMENT TYPE
  ========================================= */

  approveDocumentType(): void {

    if (!this.selectedDocumentType) {
      return;
    }

    this.selectedDocumentType.isActive =
      true;

    this.selectedDocumentType.updatedDate =
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
     REJECT DOCUMENT TYPE
  ========================================= */

  rejectDocumentType(): void {

    if (!this.selectedDocumentType) {
      return;
    }

    this.selectedDocumentType.isActive =
      false;

    this.selectedDocumentType.updatedDate =
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
      this.filteredDocumentTypes.map(
        (document) => [

          document.documentTypeID,

          document.documentName,

          document.documentCode,

          document.allowedExtensions,

          document.maxFileSizeMB + ' MB',

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

}