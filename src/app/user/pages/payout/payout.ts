import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type PayoutTab =
  | 'features'
  | 'howToUse'
  | 'testimonials';

@Component({
  selector: 'app-payout',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './payout.html',
  styleUrl: './payout.scss'
})
export class Payout {

  /* ==========================================
     ACTIVE TAB
  ========================================== */

  activeTab: PayoutTab = 'features';

  /* ==========================================
     CHANGE TAB
  ========================================== */

  setTab(tab: PayoutTab): void {

    this.activeTab = tab;

  }
/* ==========================================
   FEATURES
========================================== */

features = [

  {
    icon: 'bi-send-fill',
    title: 'Single & Bulk Payout',
    desc: 'Transfer money to one beneficiary or thousands in a single click.'
  },

  {
    icon: 'bi-shield-check',
    title: 'Secure Approvals',
    desc: 'Multi-level approval workflow with complete security.'
  },

  {
    icon: 'bi-clock-history',
    title: 'Real Time Status',
    desc: 'Track every payout instantly with detailed status updates.'
  },

  {
    icon: 'bi-bank',
    title: 'Bank & UPI Support',
    desc: 'Transfer funds directly to bank accounts and UPI IDs.'
  }

];


/* ==========================================
   HOW TO USE
========================================== */

steps = [

  {
    icon: 'bi-person-plus-fill',
    title: 'Add Beneficiaries',
    desc: 'Add employees, vendors or customers with their bank account or UPI details.'
  },

  {
    icon: 'bi-wallet-fill',
    title: 'Create Payout',
    desc: 'Choose beneficiary, enter amount and review your payout before sending.'
  },

  {
    icon: 'bi-check-circle-fill',
    title: 'Transfer Money',
    desc: 'Approve and complete the payout instantly with complete tracking.'
  }

];
/* ==========================================
   TESTIMONIALS
========================================== */

testimonials = [

  {
    name: 'Rahul Sharma',
    designation: 'Finance Manager',
    company: 'ABC Technologies',
    message:
      'BankU Payout has simplified our salary and vendor payments. The dashboard is clean, fast and extremely reliable.',
    initials: 'RS'
  },

  {
    name: 'Priya Verma',
    designation: 'Accounts Head',
    company: 'XYZ Solutions',
    message:
      'Bulk payouts now take just a few minutes. BankU has significantly reduced our manual work.',
    initials: 'PV'
  }

];
}