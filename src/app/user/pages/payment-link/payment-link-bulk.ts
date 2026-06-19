import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-link-bulk',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './payment-link-bulk.html',
  styleUrl: './payment-link-bulk.scss'
})
export class PaymentLinkBulkComponent {

  /* ==========================================
      CUSTOMER DATA CAPTURE
  ========================================== */

  customerExpanded = true;

  /* ==========================================
      CREATE FIELD MODAL
  ========================================== */

  showFieldModal = false;

  /* ==========================================
      OPEN MODAL
  ========================================== */

  openFieldModal() {

    this.showFieldModal = true;

  }

  /* ==========================================
      CLOSE MODAL
  ========================================== */

  closeFieldModal() {

    this.showFieldModal = false;

  }
selectedFileName = '';

onFileSelected(event: Event): void {

  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {

    this.selectedFileName = input.files[0].name;

  }

}

showInstructionModal = false;

openInstructionModal(): void {

  this.showInstructionModal = true;

}

closeInstructionModal(): void {

  this.showInstructionModal = false;

}
}