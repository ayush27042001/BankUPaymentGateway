import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-filter.html',
  styleUrls: ['./search-filter.scss']
})
export class CommonSearchFilterComponent {

  serviceType = 'All Service';
  fromDate = '';
  toDate = '';
  status = 'All';

  onSearch(): void {
    console.log('Search clicked');
  }

  onReset(): void {
    this.serviceType = 'All Service';
    this.fromDate = '';
    this.toDate = '';
    this.status = 'All';
  }

  onExport(): void {
    console.log('Export clicked');
  }

}