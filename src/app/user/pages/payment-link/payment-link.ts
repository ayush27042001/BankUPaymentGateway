import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

// export class PaymentLinkComponent implements OnInit {

//   ngOnInit(): void {

//     this.loadCalendars();

//   }

// }
type MainTab =
  | 'links'
  | 'bulk'
  | 'old';

@Component({
  selector: 'app-payment-link',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './payment-link.html',
  styleUrl: './payment-link.scss'
})
export class PaymentLinkComponent {
  constructor(private router: Router) {}

  /* ===========================================
      TOP TABS
  =========================================== */

  activeTab: MainTab = 'links';
  actionMode: 'list' | 'create' | 'bulk' = 'list';

  setTab(tab: MainTab) {
    this.activeTab = tab;
  }

  setActionMode(mode: 'list' | 'create' | 'bulk') {
    this.actionMode = mode;
    if (mode !== 'list') {
      this.activeTab = 'links';
    }
    this.closeAllPopups();
  }

  goToCreate(){
    this.router.navigate(['/user/payment-link/create']);
  }

  goToBulk(){
    this.router.navigate(['/user/payment-link/bulk']);
  }

  /* ===========================================
      FILTER POPUP
  =========================================== */

  showFilter = false;

  toggleFilter() {

    this.showFilter = !this.showFilter;

    this.showPurpose = false;
    this.showDownload = false;

  }

  /* ===========================================
      PURPOSE
  =========================================== */

  showPurpose = false;

  selectedPurpose = 'Purpose';

  purposeList = [

    'Purpose',

    'Invoice Number',

    'Customer Name',

    'Customer Email',

    'Mobile Number'

  ];

  togglePurpose() {

    this.showPurpose = !this.showPurpose;

    this.showFilter = false;
    this.showDownload = false;

  }

  selectPurpose(item: string) {

    this.selectedPurpose = item;

    this.showPurpose = false;

  }

  /* ===========================================
      DOWNLOAD
  =========================================== */

showBulkFilter = false;

bulkStatus = {

  processed:false,

  processing:false

};



  showDownload = false;

  downloadList = [

    'CSV',

    'XLSX',

    'Txns - CSV',

    'Txns - XLSX',

    'Old Payment Link Data - CSV',

    'Old Payment Link Data - XLSX'

  ];

  toggleDownload() {

    this.showDownload = !this.showDownload;

    this.showPurpose = false;
    this.showFilter = false;

  }

  /* ===========================================
      FILTER VALUES
  =========================================== */

  status = {

    active: false,

    deactivated: false,

    expired: false

  };

  paymentType = {

    standard: false,

    partial: false

  };

  applyFilter() {

    this.showFilter = false;

  }

  resetFilter() {

    this.status = {

      active: false,

      deactivated: false,

      expired: false

    };

    this.paymentType = {

      standard: false,

      partial: false

    };

  }

  /* ===========================================
      COLUMN CONFIGURATION
  =========================================== */

  showColumnConfig = false;

  openColumnConfig() {

    this.showColumnConfig = true;

  }

  closeColumnConfig() {

    this.showColumnConfig = false;

  }

  /* ===========================================
      CLOSE ALL POPUPS
  =========================================== */

  closeAllPopups() {

    this.showFilter = false;

    this.showPurpose = false;

    this.showDownload = false;

    this.showDateDropdown = false;

    this.showDateCalendar = false;

    this.showBulkFilterDropdown = false;

  }

  availableColumns = [

    'Created On',

    'Purpose Of Payment',

    'Invoice ID',

    'Amount',

    'Payment Link',

    'Payment Type',

    'Status',

    'Customer Email',

    'Customer Mobile'

  ];

  selectedColumns = [

    'Created On',

    'Purpose Of Payment',

    'Invoice ID',

    'Amount',

    'Payment Link',

    'Payment Type',

    'Status'

  ];

  availableSearch = '';
  selectedSearch = '';

  get filteredAvailableColumns(): string[] {
    const filter = this.availableSearch.trim().toLowerCase();
    return filter ? this.availableColumns.filter(col => col.toLowerCase().includes(filter)) : this.availableColumns;
  }

  get filteredSelectedColumns(): string[] {
    const filter = this.selectedSearch.trim().toLowerCase();
    return filter ? this.selectedColumns.filter(col => col.toLowerCase().includes(filter)) : this.selectedColumns;
  }


  tableData: Array<Record<string, string>> = [
    {
      'Created On': "12 Jun'26",
      'Purpose Of Payment': 'Subscription Payment',
      'Invoice ID': 'INV-1001',
      'Amount': '₹2,500',
      'Payment Link': 'pay.link/abcd',
      'Payment Type': 'Standard',
      'Status': 'Active'
    },
    {
      'Created On': "10 Jun'26",
      'Purpose Of Payment': 'Invoice Payment',
      'Invoice ID': 'INV-1002',
      'Amount': '₹7,800',
      'Payment Link': 'pay.link/efgh',
      'Payment Type': 'Partial',
      'Status': 'Expired'
    }
  ];

  applyConfiguration() {

    this.showColumnConfig = false;

  }

  resetConfiguration() {

    this.selectedColumns = [

      'Created On',

      'Purpose Of Payment',

      'Invoice ID',

      'Amount',

      'Payment Link',

      'Payment Type',

      'Status'

    ];

  }

  isColumnSelected(column: string): boolean {

    return this.selectedColumns.includes(column);

  }

  toggleColumnSelection(column: string): void {

    if (this.isColumnSelected(column)) {

      this.removeColumn(column);

    } else {

      this.selectedColumns.push(column);

    }

  }

  removeColumn(column: string): void {

    this.selectedColumns = this.selectedColumns.filter(col => col !== column);

  }

  closeOnBackdropClick(event: MouseEvent): void {

    if (event.target === event.currentTarget) {

      this.closeColumnConfig();

    }

  }


// ======================================
// DATE RANGE PICKER
// ======================================

showDateDropdown = false;
showDateCalendar = false;
selectedDateOption = 'Last 7 Days';
selectedStart: Date | null = null;
selectedEnd: Date | null = null;

dateOptions = [
  'Today',
  'Yesterday',
  'Last 7 Days',
  'Last 30 Days',
  'Custom Range'
];

// =========================================
// DYNAMIC CALENDAR
// =========================================

months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

weekDays = ['Su','Mo','Tu','We','Th','Fr','Sa'];

leftMonth = 5;
leftYear = 2026;

rightMonth = 6;
rightYear = 2026;

leftCalendar:any[]=[];
rightCalendar:any[]=[];

fromDate = "12 Jun'26";

toDate = "18 Jun'26";

// ======================================

toggleDateDropdown(){
  const nextState = !this.showDateDropdown;
  this.showDateDropdown = nextState;
  this.showDateCalendar = false;
  this.selectedStart = null;
  this.selectedEnd = null;

  this.showBulkFilter = false;
  this.showFilter = false;
  this.showPurpose = false;
  this.showDownload = false;
}

closeDatePopups(){
  this.showDateDropdown = false;
  this.showDateCalendar = false;
}

selectDate(item: string){

  this.selectedDateOption = item;

  if (item === 'Custom Range') {

    this.showDateCalendar = true;
    this.showDateDropdown = false;
    this.loadCalendars();
    return;

  }

  // Quick date selection
  this.setQuickDate(item);
  this.showDateDropdown = false;
  this.showDateCalendar = false;

}

setQuickDate(option: string){

  switch(option){

    case 'Today':

      this.fromDate="18 Jun'26";
      this.toDate="18 Jun'26";
      break;

    case 'Yesterday':

      this.fromDate="17 Jun'26";
      this.toDate="17 Jun'26";
      break;

    case 'Last 7 Days':

      this.fromDate="12 Jun'26";
      this.toDate="18 Jun'26";
      break;

    case 'Last 30 Days':

      this.fromDate="19 May'26";
      this.toDate="18 Jun'26";
      break;

  }

}

// ======================================

loadCalendars(){

    this.leftCalendar=this.createCalendar(
        this.leftMonth,
        this.leftYear
    );

    this.rightCalendar=this.createCalendar(
        this.rightMonth,
        this.rightYear
    );

}
createCalendar(month:number,year:number){

    const days=[];

    const firstDay=new Date(year,month,1).getDay();

    const totalDays=new Date(year,month+1,0).getDate();

    for(let i=0;i<firstDay;i++){

        days.push(null);

    }

    for(let d=1;d<=totalDays;d++){

        days.push(new Date(year,month,d));

    }

    return days;

}
previousMonth(){

    this.leftMonth--;

    if(this.leftMonth<0){

        this.leftMonth=11;
        this.leftYear--;

    }

    this.rightMonth=this.leftMonth+1;
    this.rightYear=this.leftYear;

    if(this.rightMonth>11){

        this.rightMonth=0;
        this.rightYear++;

    }

    this.loadCalendars();

}
nextMonth(){

    this.leftMonth++;

    if(this.leftMonth>11){

        this.leftMonth=0;
        this.leftYear++;

    }

    this.rightMonth=this.leftMonth+1;
    this.rightYear=this.leftYear;

    if(this.rightMonth>11){

        this.rightMonth=0;
        this.rightYear++;

    }

    this.loadCalendars();

}
// ======================================

applyDateRange(){

  this.showDateDropdown = false;
  this.showDateCalendar = false;

}

resetDateRange(){
  this.selectedDateOption = 'Last 7 Days';
  this.selectedStart = null;
  this.selectedEnd = null;
  this.fromDate = "12 Jun'26";
  this.toDate = "18 Jun'26";
}

selectCalendarDay(day: Date | null){
  if (!day) {
    return;
  }

  this.selectedDateOption = 'Custom Range';

  if (!this.selectedStart || (this.selectedStart && this.selectedEnd)) {
    this.selectedStart = day;
    this.selectedEnd = null;
  } else if (day < this.selectedStart) {
    this.selectedStart = day;
    this.selectedEnd = null;
  } else {
    this.selectedEnd = day;
  }

  this.fromDate = this.formatDate(this.selectedStart);
  this.toDate = this.selectedEnd ? this.formatDate(this.selectedEnd) : this.fromDate;
}

formatDate(date: Date | null){
  if (!date) {
    return '';
  }

  const day = date.getDate();
  const month = this.months[date.getMonth()].slice(0, 3);
  const year = date.getFullYear().toString().slice(-2);

  return `${day} ${month}'${year}`;
}

isDayActive(day: Date | null){
  if (!day || !this.selectedStart) {
    return false;
  }

  if (this.selectedEnd) {
    return day.getTime() === this.selectedStart.getTime() || day.getTime() === this.selectedEnd.getTime();
  }

  return day.getTime() === this.selectedStart.getTime();
}

isDayInRange(day: Date | null){
  if (!day || !this.selectedStart || !this.selectedEnd) {
    return false;
  }

  return day.getTime() > this.selectedStart.getTime() && day.getTime() < this.selectedEnd.getTime();
}

// ======================================
// BULK FILTER
// ======================================

showBulkFilterDropdown = false;

bulkFilterOptions = [
  'All',
  'Pending',
  'Completed',
  'Failed'
];

selectedBulkFilter = 'All';

toggleBulkFilterDropdown(){

  this.showBulkFilterDropdown = !this.showBulkFilterDropdown;

  this.showDateDropdown = false;
  this.showFilter = false;
  this.showPurpose = false;
  this.showDownload = false;

}

closeBulkFilterPopup(){

  this.showBulkFilterDropdown = false;

}

selectBulkFilter(option: string){

  this.selectedBulkFilter = option;
  this.showBulkFilterDropdown = false;

}

}
