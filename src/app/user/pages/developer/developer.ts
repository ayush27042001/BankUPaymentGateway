import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Webhook {
  createdOn: string;
  createdAt: string;
  type: string;
  event: string;
  url: string;
  remarks: string;
  isActive: boolean;
}

@Component({
  selector: 'app-developer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './developer.html',
  styleUrl: './developer.scss',
})
export class Developer {

  activeTab: string = 'apiKeys';

  showPasswordModal = false;
  password = '';

  apiKey = 'LHps9s';
  salt = '***************';

  clientId = 'banku_client_id';
  clientSecret = '********************************';

  isVerified = false;

  /* =========================================
     WEBHOOKS
  ========================================= */

  webhookTypes = ['payments', 'refunds', 'payouts'];
  webhookEvents = ['successful', 'failed', 'pending', 'all'];

  webhooks: Webhook[] = [
    {
      createdOn: "11 Jun'26",
      createdAt: '11:47:05 AM',
      type: 'payments',
      event: 'successful',
      url: 'https://app.banku.co.in/api/PayuCallBack',
      remarks: '--',
      isActive: true
    }
  ];

  showEditModal = false;
  editingIndex = -1;
  editForm: { type: string; event: string; url: string } = {
    type: '',
    event: '',
    url: ''
  };

  showCreateModal = false;
  createForm: { type: string; event: string; url: string } = {
    type: '',
    event: '',
    url: ''
  };

  showDeleteConfirm = false;
  deleteIndex = -1;

  /* =========================================
     API KEYS
  ========================================= */

  openPasswordModal(): void {
    this.showPasswordModal = true;
    this.password = '';
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
  }

  verifyPassword(): void {

    if (!this.password.trim()) {
      alert('Please enter password');
      return;
    }

    this.isVerified = true;
    this.showPasswordModal = false;
  }

  copyText(value: string): void {

  if (!value) {
    return;
  }

  if (
    navigator &&
    navigator.clipboard &&
    window.isSecureContext
  ) {

    navigator.clipboard.writeText(value)
      .then(() => {

        alert('Copied Successfully');

      })
      .catch(() => {

        this.fallbackCopy(value);

      });

    return;
  }

  this.fallbackCopy(value);
}

private fallbackCopy(
  value: string
): void {

  const textarea =
    document.createElement('textarea');

  textarea.value = value;

  textarea.style.position = 'fixed';
  textarea.style.left = '-999999px';
  textarea.style.top = '-999999px';

  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();

  try {

    document.execCommand('copy');

    alert('Copied Successfully');

  } catch {

    alert('Copy Failed');

  }

  document.body.removeChild(textarea);
}

  regenerateSalt(): void {
    alert('Salt regenerated successfully');
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }

  /* =========================================
     WEBHOOK METHODS
  ========================================= */

  openCreateModal(): void {
    this.createForm = { type: '', event: '', url: '' };
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  createWebhook(): void {
    if (!this.createForm.type || !this.createForm.event || !this.createForm.url) {
      alert('Please fill all fields');
      return;
    }
    this.webhooks.push({
      createdOn: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/-/g, "'"),
      createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
      type: this.createForm.type,
      event: this.createForm.event,
      url: this.createForm.url,
      remarks: '--',
      isActive: true
    });
    this.closeCreateModal();
  }

  openEditModal(index: number): void {
    this.editingIndex = index;
    const wh = this.webhooks[index];
    this.editForm = { type: wh.type, event: wh.event, url: wh.url };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingIndex = -1;
  }

  saveWebhook(): void {
    if (!this.editForm.type || !this.editForm.event || !this.editForm.url) {
      alert('Please fill all fields');
      return;
    }
    this.webhooks[this.editingIndex] = {
      ...this.webhooks[this.editingIndex],
      type: this.editForm.type,
      event: this.editForm.event,
      url: this.editForm.url
    };
    this.closeEditModal();
  }

  confirmDelete(index: number): void {
    this.deleteIndex = index;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.deleteIndex = -1;
  }

  deleteWebhook(): void {
    this.webhooks.splice(this.deleteIndex, 1);
    this.cancelDelete();
  }

  toggleWebhookStatus(index: number): void {
    this.webhooks[index].isActive = !this.webhooks[index].isActive;
  }
}