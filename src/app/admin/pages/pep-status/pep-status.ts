import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pep-status',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './pep-status.html',
  styleUrl: './pep-status.scss',
})
export class PepStatus {

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

  pepStatusList = [

    {
      pepStatusID: 1,
      statusName: 'Not Applicable',
      description:
        'Not a Politically Exposed Person',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      pepStatusID: 2,
      statusName: 'I am a PEP',
      description:
        'I am a Politically Exposed Person',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      pepStatusID: 3,
      statusName: 'I am related to a PEP',
      description:
        'I am related to a Politically Exposed Person',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    }

  ];

  /* =========================================
     FILTERED DATA
  ========================================= */

  filteredPepStatus = [
    ...this.pepStatusList
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

    return this.filteredPepStatus.slice(
      startIndex,
      endIndex
    );

  }

  /* =========================================
     TOTAL PAGES
  ========================================= */

  get totalPages(): number {

    return Math.ceil(
      this.filteredPepStatus.length
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
     FILTER PEP STATUS
  ========================================= */

  filterPepStatus(): void {

    const search =
      this.searchTerm
        .toLowerCase()
        .trim();

    if (!search) {

      this.filteredPepStatus = [
        ...this.pepStatusList
      ];

      this.currentPage = 1;

      return;

    }

    this.filteredPepStatus =
      this.pepStatusList.filter((pep) => {

        return (

          pep.pepStatusID
            .toString()
            .includes(search)

          ||

          pep.statusName
            .toLowerCase()
            .includes(search)

          ||

          pep.description
            .toLowerCase()
            .includes(search)

          ||

          (
            pep.isActive
              ? 'active'
              : 'inactive'
          ).includes(search)

        );

      });

    this.currentPage = 1;

  }

  /* =========================================
     OPEN VIEW MODAL
  ========================================= */

  openViewModal(pep: any): void {

    this.selectedPepStatus = pep;

    this.showViewModal = true;

    document.body.style.overflow = 'hidden';

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

      pepStatusID:
        this.pepStatusList.length + 1,

      statusName:
        this.newPepStatus.statusName,

      description:
        this.newPepStatus.description,

      isActive:
        this.newPepStatus.isActive,

      createdDate:
        currentDate,

      updatedDate:
        currentDate,

    };

    this.pepStatusList.unshift(
      newEntry
    );

    this.filteredPepStatus = [
      ...this.pepStatusList
    ];

    this.currentPage = 1;

    this.closeAddModal();

  }

  /* =========================================
     APPROVE
  ========================================= */

  approvePepStatus(): void {

    if (!this.selectedPepStatus) {
      return;
    }

    this.selectedPepStatus.isActive = true;

    this.selectedPepStatus.updatedDate =
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

  rejectPepStatus(): void {

    if (!this.selectedPepStatus) {
      return;
    }

    this.selectedPepStatus.isActive = false;

    this.selectedPepStatus.updatedDate =
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

      'Status Name',

      'Description',

      'Status',

      'Created Date',

      'Updated Date'

    ];

    const rows =
      this.filteredPepStatus.map(
        (pep) => [

          pep.pepStatusID,

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

}