import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-business-entity-types',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    FormsModule
  ],
  templateUrl: './business-entity-types.html',
  styleUrl: './business-entity-types.scss'
})
export class BusinessEntityTypes implements OnInit {

  /* =========================================
  SEARCH
  ========================================= */

  searchText = '';

  /* =========================================
  MODALS
  ========================================= */

  showModal = false;

  showAddModal = false;

  selectedEntity: any = null;

  /* =========================================
  PAGINATION
  ========================================= */

  currentPage = 1;

  itemsPerPage = 5;

  totalPages = 1;

  paginatedEntities: any[] = [];

  filteredEntities: any[] = [];

  /* =========================================
  ADD ENTITY FORM
  ========================================= */

  newEntity = {
    entityName: '',
    description: '',
    isActive: true
  };

  /* =========================================
  TABLE DATA
  ========================================= */

  businessEntityTypes = [

    {
      businessEntityTypeID: 1,
      entityName: 'Individual',
      description: 'Individual/Sole Proprietor',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026'
    },

    {
      businessEntityTypeID: 2,
      entityName: 'Sole Proprietorship',
      description: 'Sole Proprietorship Firm',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026'
    },

    {
      businessEntityTypeID: 3,
      entityName: 'Partnership',
      description: 'Partnership Firm',
      isActive: false,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026'
    },

    {
      businessEntityTypeID: 4,
      entityName: 'Limited Liability Partnership',
      description: 'LLP',
      isActive: false,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026'
    },

    {
      businessEntityTypeID: 5,
      entityName: 'Private Limited Company',
      description: 'Pvt Ltd Company',
      isActive: false,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026'
    },

    {
      businessEntityTypeID: 6,
      entityName: 'Public Limited Company',
      description: 'Public Ltd Company',
      isActive: false,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026'
    },

    {
      businessEntityTypeID: 7,
      entityName: 'One Person Company',
      description: 'OPC',
      isActive: false,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026'
    }

  ];

  /* =========================================
  INIT
  ========================================= */

  ngOnInit(): void {

    this.filteredEntities = [...this.businessEntityTypes];

    this.updatePagination();

  }

  /* =========================================
  SEARCH FILTER
  ========================================= */

  filterEntities(): void {

    const search = this.searchText
      .toLowerCase()
      .trim();

    this.filteredEntities =
      this.businessEntityTypes.filter(entity => {

        return (

          entity.businessEntityTypeID
            .toString()
            .includes(search)

          ||

          entity.entityName
            .toLowerCase()
            .includes(search)

          ||

          entity.description
            .toLowerCase()
            .includes(search)

          ||

          (
            entity.isActive
              ? 'active'
              : 'inactive'
          )
            .includes(search)

        );

      });

    this.currentPage = 1;

    this.updatePagination();

  }

  /* =========================================
  PAGINATION
  ========================================= */

  updatePagination(): void {

    this.totalPages = Math.ceil(
      this.filteredEntities.length /
      this.itemsPerPage
    );

    const startIndex =
      (this.currentPage - 1)
      * this.itemsPerPage;

    const endIndex =
      startIndex + this.itemsPerPage;

    this.paginatedEntities =
      this.filteredEntities.slice(
        startIndex,
        endIndex
      );

  }

  nextPage(): void {

    if (this.currentPage < this.totalPages) {

      this.currentPage++;

      this.updatePagination();

    }

  }

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.updatePagination();

    }

  }

  /* =========================================
  VIEW MODAL
  ========================================= */

  openDetails(entity: any): void {

    this.selectedEntity = entity;

    this.showModal = true;

    document.body.style.overflow = 'hidden';

  }

  closeModal(): void {

    this.showModal = false;

    this.selectedEntity = null;

    document.body.style.overflow = 'auto';

  }

  /* =========================================
  ADD MODAL
  ========================================= */

  openAddModal(): void {

    this.showAddModal = true;

    document.body.style.overflow = 'hidden';

  }

  closeAddModal(): void {

    this.showAddModal = false;

    document.body.style.overflow = 'auto';

    this.resetForm();

  }

  /* =========================================
  SAVE ENTITY
  ========================================= */

  saveEntity(): void {

    if (
      !this.newEntity.entityName.trim()
      ||
      !this.newEntity.description.trim()
    ) {

      alert(
        'Please fill all required fields'
      );

      return;

    }

    const newId =
      this.businessEntityTypes.length + 1;

    const entity = {

      businessEntityTypeID: newId,

      entityName:
        this.newEntity.entityName,

      description:
        this.newEntity.description,

      isActive:
        this.newEntity.isActive,

      createdDate: '11 May 2026',

      updatedDate: '11 May 2026'

    };

    this.businessEntityTypes.unshift(entity);

    this.filterEntities();

    this.closeAddModal();

    alert(
      'Entity Added Successfully'
    );

  }

  /* =========================================
  RESET FORM
  ========================================= */

  resetForm(): void {

    this.newEntity = {

      entityName: '',

      description: '',

      isActive: true

    };

  }

  /* =========================================
  APPROVE
  ========================================= */

  approveEntity(): void {

    if (this.selectedEntity) {

      this.selectedEntity.isActive = true;

      this.filterEntities();

      alert(
        `${this.selectedEntity.entityName}
        Approved Successfully`
      );

    }

    this.closeModal();

  }

  /* =========================================
  REJECT
  ========================================= */

  rejectEntity(): void {

    if (this.selectedEntity) {

      this.selectedEntity.isActive = false;

      this.filterEntities();

      alert(
        `${this.selectedEntity.entityName}
        Rejected Successfully`
      );

    }

    this.closeModal();

  }

  /* =========================================
  EXPORT CSV
  ========================================= */

  exportToCSV(): void {

    const headers = [

      'BusinessEntityTypeID',
      'EntityName',
      'Description',
      'IsActive',
      'CreatedDate',
      'UpdatedDate'

    ];

    const rows =
      this.filteredEntities.map(entity => [

        entity.businessEntityTypeID,

        entity.entityName,

        entity.description,

        entity.isActive ? 1 : 0,

        entity.createdDate,

        entity.updatedDate

      ]);

    const csvContent = [

      headers.join(','),

      ...rows.map(row => row.join(','))

    ].join('\n');

    const blob = new Blob(
      [csvContent],
      {
        type: 'text/csv;charset=utf-8;'
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;

    link.download =
      'business-entity-types.csv';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

  }

  /* =========================================
  EDIT MODAL
  ========================================= */

  showEditModal: boolean = false;

  editEntity: any = {
    businessEntityTypeID: 0,
    entityName: '',
    description: '',
    isActive: true,
    createdDate: '',
    updatedDate: ''
  };

  /* =========================================
  OPEN EDIT MODAL
  ========================================= */

  openEditModal(entity: any): void {

    this.editEntity = {
      ...entity
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

  /* =========================================
  UPDATE ENTITY
  ========================================= */

  updateEntity(): void {

    if (
      !this.editEntity.entityName.trim()
      ||
      !this.editEntity.description.trim()
    ) {

      alert(
        'Please fill all required fields.'
      );

      return;

    }

    const index =
      this.businessEntityTypes.findIndex(
        (entity) =>
          entity.businessEntityTypeID ===
          this.editEntity.businessEntityTypeID
      );

    if (index !== -1) {

      this.businessEntityTypes[index] = {

        ...this.editEntity,

        updatedDate:
          new Date().toLocaleDateString(
            'en-GB',
            {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }
          )

      };

      this.filteredEntities = [
        ...this.businessEntityTypes
      ];

    }

    this.closeEditModal();

  }

}