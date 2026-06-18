import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';

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

  /* ===========================================
      TOP TABS
  =========================================== */

  activeTab: MainTab = 'links';

  setTab(tab: MainTab) {

    this.activeTab = tab;

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

toggleBulkFilter(){

  this.showBulkFilter=!this.showBulkFilter;

}


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


// ======================================
// DATE RANGE PICKER
// ======================================

showDateFilter = false;

selectedDateOption = 'Last 7 Days';

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

selectedStart:Date|null=null;
selectedEnd:Date|null=null;

fromDate = "12 Jun'26";

toDate = "18 Jun'26";

// ======================================

toggleDateFilter(){

  this.showDateFilter = !this.showDateFilter;

  this.showFilter=false;
  this.showPurpose=false;
  this.showDownload=false;

}

// ======================================

selectDate(item:string){

  this.selectedDateOption=item;

  switch(item){

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

    case 'Custom Range':

      this.fromDate='';
      this.toDate='';
      break;

  }

}
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

  this.showDateFilter=false;

}

// ======================================

resetDateRange(){

  this.selectedDateOption='Last 7 Days';

  this.fromDate="12 Jun'26";

  this.toDate="18 Jun'26";

}
}
