import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chargeback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {

  activeTab: string = 'category';

  categoryCards = [
    {
      title: 'Transaction',
      description: 'Fetch transaction data including payment, customer information and status.',
      icon: 'bi-arrow-down-up'
    },
    {
      title: 'Settlement',
      description: 'Fetch settlement details with statuses and consolidated information.',
      icon: 'bi-bank'
    },
    {
      title: 'Refunds',
      description: 'Fetch initiated refund records and current refund statuses.',
      icon: 'bi-arrow-counterclockwise'
    }
  ];

  downloadCards = [
    {
      title: 'Downloaded Report',
      description: 'View previously downloaded reports.'
    },
    {
      title: 'Monthly Statement',
      description: 'Download history of generated statements.'
    }
  ];

  scheduleCards = [
    {
      title: 'Daily Report',
      description: 'Scheduled every day at 09:00 AM.'
    },
    {
      title: 'Weekly Settlement',
      description: 'Scheduled every Sunday.'
    }
  ];

  changeTab(tab: string) {
    this.activeTab = tab;
  }
}