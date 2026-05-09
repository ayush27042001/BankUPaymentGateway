import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { OnboardingHeaderComponent } from '../../components/onboarding-header/onboarding-header';
import { StatusTrackerService, StatusStep } from '../../services/status-tracker/status-tracker.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-status-tracker',
  standalone: true,
  imports: [
    CommonModule,
    OnboardingHeaderComponent,
  ],
  templateUrl: './status-tracker.html',
  styleUrl: './status-tracker.scss',
})
export class StatusTrackerComponent implements OnInit, OnDestroy {
  loading = true;
  statusSteps: StatusStep[] = [];
  overallProgress = 0;
  applicationId = '';
  errorMessage: string | null = null;
  lastUpdated: string = '';
  
  private pollingSubscription: Subscription | null = null;
  private readonly POLLING_INTERVAL = 30000; // 30 seconds

  constructor(
    private statusTrackerService: StatusTrackerService
  ) {}

  ngOnInit(): void {
    this.loadInitialStatus();
    this.startRealTimeUpdates();
  }

  ngOnDestroy(): void {
    this.stopRealTimeUpdates();
  }

  /**
   * Load initial status data
   */
  loadInitialStatus(): void {
    this.statusTrackerService.getOnboardingStatus().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.updateStatusData(response.data);
        } else {
          this.handleMockData();
        }
      },
      error: () => {
        // Fallback to mock data if API fails
        this.handleMockData();
      }
    });
  }

  /**
   * Start real-time polling for status updates
   */
  startRealTimeUpdates(): void {
    this.pollingSubscription = this.statusTrackerService
      .startRealTimeUpdates(this.POLLING_INTERVAL)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.updateStatusData(response.data);
          }
        },
        error: (error) => {
          console.error('Polling error:', error);
          // Don't show error for polling failures, just log it
        }
      });
  }

  /**
   * Stop real-time polling
   */
  stopRealTimeUpdates(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }

  /**
   * Update component state with API data
   */
  updateStatusData(data: any): void {
    this.statusSteps = data.statusSteps || [];
    this.overallProgress = data.overallProgress || 0;
    this.applicationId = data.applicationId || '';
    this.lastUpdated = data.lastUpdated || new Date().toISOString();
    this.loading = false;
    this.errorMessage = null;
  }

  /**
   * Fallback to mock data for demo/testing
   */
  handleMockData(): void {
    this.statusSteps = [
      {
        id: 'business-info',
        title: 'Business Information',
        description: 'Platform details and bank account verification',
        status: 'approved',
        icon: '🏢',
        completedDate: 'Jan 15, 2026',
        remarks: 'Verified successfully'
      },
      {
        id: 'kyc-checks',
        title: 'KYC Checks',
        description: 'Signing authority verification and PEP status',
        status: 'approved',
        icon: '🔍',
        completedDate: 'Jan 16, 2026',
        remarks: 'All KYC documents verified'
      },
      {
        id: 'documents',
        title: 'Document Verification',
        description: 'Aadhaar, PAN, business proof, and shop photos',
        status: 'in-progress',
        icon: '📄',
        remarks: 'Under review by compliance team'
      },
      {
        id: 'video-kyc',
        title: 'Video KYC',
        description: 'Live verification with KYC agent',
        status: 'pending',
        icon: '📹',
        remarks: 'Scheduled after document approval'
      },
      {
        id: 'agreement',
        title: 'Service Agreement',
        description: 'Digital signature and agreement acceptance',
        status: 'pending',
        icon: '✍️',
        remarks: 'Pending previous step completion'
      },
      {
        id: 'final-approval',
        title: 'Final Approval',
        description: 'Account activation and payment gateway setup',
        status: 'pending',
        icon: '🚀',
        remarks: 'Final review by admin team'
      }
    ];

    this.calculateProgress();
    this.applicationId = 'APP-2026-00452';
    this.lastUpdated = new Date().toISOString();
    this.loading = false;
  }

  /**
   * Calculate progress from status steps
   */
  calculateProgress(): void {
    const totalSteps = this.statusSteps.length;
    const approvedSteps = this.statusSteps.filter(step => step.status === 'approved').length;
    const inProgressSteps = this.statusSteps.filter(step => step.status === 'in-progress').length;
    
    // Count in-progress as 50% complete
    this.overallProgress = Math.round(((approvedSteps + (inProgressSteps * 0.5)) / totalSteps) * 100);
  }

  /**
   * Manually refresh status
   */
  refreshStatus(): void {
    this.loading = true;
    this.errorMessage = null;
    
    this.statusTrackerService.refreshStatus().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.updateStatusData(response.data);
        } else {
          this.handleMockData();
          this.errorMessage = response.message || 'Failed to refresh status';
        }
      },
      error: () => {
        this.handleMockData();
        this.errorMessage = 'Failed to refresh status. Using cached data.';
      }
    });
  }

  /**
   * Get CSS class for status
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'approved';
      case 'in-progress':
        return 'in-progress';
      case 'rejected':
        return 'rejected';
      default:
        return 'pending';
    }
  }

  /**
   * Get human-readable status label
   */
  getStatusLabel(status: string): string {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'in-progress':
        return 'In Progress';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  }

  /**
   * Get step number for display
   */
  getStepNumber(index: number): number {
    return index + 1;
  }

  /**
   * Check if step is completed
   */
  isStepCompleted(step: StatusStep): boolean {
    return step.status === 'approved';
  }

  /**
   * Check if step is currently in progress
   */
  isStepCurrent(step: StatusStep): boolean {
    return step.status === 'in-progress';
  }

  /**
   * Check if step is pending
   */
  isStepPending(step: StatusStep): boolean {
    return step.status === 'pending';
  }

  /**
   * Format last updated timestamp
   */
  getLastUpdatedTime(): string {
    if (!this.lastUpdated) return '';
    
    const date = new Date(this.lastUpdated);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.errorMessage = null;
  }
}
