import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HorizontalTableScrollDirective } from '../../../shared/directives/horizontal-table-scroll.directive';
import {
  BusinessEntityTypesService,
  AddBusinessEntityTypeRequest,
  UpdateBusinessEntityTypeRequest
} from '../../services/business-entity-types.service';

@Component({
  selector: 'app-business-entity-types',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    FormsModule,
    HorizontalTableScrollDirective
  ],
  templateUrl: './business-entity-types.html',
  styleUrl: './business-entity-types.scss'
})
export class BusinessEntityTypes implements OnInit {

  private businessEntityTypesService = inject(BusinessEntityTypesService);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

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

  totalCount = 0;

  totalPages = 0;

  hasPreviousPage = false;

  hasNextPage = false;

  paginatedEntities: any[] = [];

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

  businessEntityTypes: any[] = [];

  /* =========================================
  INIT
  ========================================= */

  ngOnInit(): void {

    this.loadBusinessEntityTypes();

  }

  /* =========================================
  LOAD BUSINESS ENTITY TYPES
  ========================================= */

  loadBusinessEntityTypes(
    pageNumber: number = this.currentPage,
    pageSize: number = this.itemsPerPage,
    search: string = this.searchText
  ): void {

    this.businessEntityTypesService
      .getBusinessEntityTypesList(
        pageNumber,
        pageSize,
        search
      )
      .subscribe({

        next: (response: any) => {

          if (response.success) {

            this.businessEntityTypes =
              response.data.items.map((item: any) => ({

                businessEntityTypeId: item.businessEntityTypeId,

                entityName: item.entityName,

                description: item.description,

                isActive: item.isActive,

                createdDate: item.createdDate,

                updatedDate: item.updatedDate

              }));

            this.paginatedEntities = [
              ...this.businessEntityTypes
            ];

            this.currentPage = response.data.pageNumber;
            this.itemsPerPage = response.data.pageSize;
            this.totalCount = response.data.totalCount;
            this.totalPages = response.data.totalPages;
            this.hasPreviousPage = response.data.hasPreviousPage;
            this.hasNextPage = response.data.hasNextPage;

          }

        },

        error: (err: any) => {

          console.error(err);

          this.toastr.error(
            'Failed to load Business Entity Types.',
            'Error'
          );

        }

      });

  }

  /* =========================================
  SEARCH FILTER
  ========================================= */

  filterEntities(): void {

    this.currentPage = 1;

    this.loadBusinessEntityTypes(
      this.currentPage,
      this.itemsPerPage,
      this.searchText
    );

  }

  /* =========================================
  PAGINATION
  ========================================= */

  nextPage(): void {

    if (this.hasNextPage) {

      this.loadBusinessEntityTypes(
        this.currentPage + 1,
        this.itemsPerPage,
        this.searchText
      );

    }

  }

  previousPage(): void {

    if (this.hasPreviousPage) {

      this.loadBusinessEntityTypes(
        this.currentPage - 1,
        this.itemsPerPage,
        this.searchText
      );

    }

  }

  /* =========================================
  VIEW MODAL
  ========================================= */

  openDetails(entity: any): void {

    this.businessEntityTypesService
      .getBusinessEntityTypeById(entity.businessEntityTypeId)
      .subscribe({

        next: (response: any) => {

          if (response.success) {

            this.selectedEntity = response.data;

            this.showModal = true;

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

    this.cdr.detectChanges();

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

      this.toastr.warning(
        'Please fill all required fields.',
        'Validation'
      );

      return;

    }

    const request: AddBusinessEntityTypeRequest = {

      entityName: this.newEntity.entityName,

      description: this.newEntity.description

    };

    this.businessEntityTypesService
      .addBusinessEntityType(request)
      .subscribe({

        next: (response: any) => {

          if (response.success) {

            this.toastr.success(
              response.message,
              'Success'
            );

            this.resetForm();
            this.closeAddModal();
            this.loadBusinessEntityTypes();

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

      this.loadBusinessEntityTypes();

    }

    this.closeModal();

  }

  /* =========================================
  REJECT
  ========================================= */

  rejectEntity(): void {

    if (this.selectedEntity) {

      this.selectedEntity.isActive = false;

      this.loadBusinessEntityTypes();

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
      this.businessEntityTypes.map(entity => [

        entity.businessEntityTypeId,

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
    businessEntityTypeId: 0,
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

    this.cdr.detectChanges();

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

      this.toastr.warning(
        'Please fill all required fields.',
        'Validation'
      );

      return;

    }

    const request: UpdateBusinessEntityTypeRequest = {

      businessEntityTypeId: this.editEntity.businessEntityTypeId,

      entityName: this.editEntity.entityName,

      description: this.editEntity.description,

      isActive: this.editEntity.isActive

    };

    this.businessEntityTypesService
      .updateBusinessEntityType(request)
      .subscribe({

        next: (response: any) => {

          if (response.success) {

            this.toastr.success(
              response.message,
              'Success'
            );

            this.closeEditModal();
            this.loadBusinessEntityTypes();

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