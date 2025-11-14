import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatMenuTrigger } from '@angular/material/menu';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { DatePipe } from '@angular/common';

export interface PolicyData {
  policyNo: string;
  policyEndDate: string;
  previousInsurer: string;
  totalInsurerQuote: number;
  renewalQuote: boolean;
  insurerQuotes: any[];
}

@Component({
  selector: 'app-motor-insurance-table',
  templateUrl: './motor-insurance-table.component.html',
  styleUrls: ['./motor-insurance-table.component.scss'],
})
export class MotorInsuranceTableComponent implements OnInit {
  displayedColumns: string[] = [
    'policyNo',
    'policyEndDate',
    'productId',
    'vehicleType',

    'previousInsurer',
    'totalInsurerQuote',
    'renewalQuote',
  ];
  minDate = new Date();
  maxDate = new Date();
  dataSource = new MatTableDataSource<PolicyData>([]);
  motorInsuranceTableForm!: FormGroup;
  insurerList: any;
  private closeTimeout = 0;
  private openTimeout = 0;
  loader: boolean = false;
  errorMessage: string = '';
  isAnyFieldFilled = false;
  ress: any = [];
  pageSize = 100;
  currentPage = 1;
  totalItems = 0;
  buffer: PolicyData[] = [];
  apiPage = 1;
  uiPageSize = 20;
  uiPageIndex = 0;
  vehcileType: any;
  currentSortDirection: 'asc' | 'desc' | '' = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private sharedDataService: SharedDataService,
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe
  ) {
    this.motorInsuranceTableForm = this.fb.group({
      date: [''],
      policy_insurer: [''],
      policy_number: [''],
      vehicle_type: [''],
    });
    this.vehcileType = [
      {
        id: 'All Vehicle',
        value: 'All Vehicle',
      },
      {
        id: 'private_car',
        value: 'Private Car',
      },
      {
        id: 'two_wheeler',
        value: 'Two Wheeler',
      },
    ];
  }

  ngOnInit(): void {
    this.motorInsuranceTableForm.valueChanges.subscribe((values) => {
      const { date, policy_insurer, policy_number, vehicle_type } = values;
      this.isAnyFieldFilled =
        !!date ||
        !!policy_insurer ||
        vehicle_type ||
        (policy_number && policy_number.trim() !== '');
    });

    // ⭐ FRONTEND SORTING FIX ⭐
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'totalInsurerQuote':
          return item.totalInsurerQuote; // sort by length
        default:
          return item[property];
      }
    };

    this.getInsurerList();
  }

  private findInsurerNameByCode(code: string): string {
    if (!code || !this.insurerList || !Array.isArray(this.insurerList))
      return '';
    const match = this.insurerList.find((i: any) => i.rb_insurer_code === code);
    return match ? match.rb_insurer_name : '';
  }

  private mapApiResult(apiResult: any[]): PolicyData[] {
    return (apiResult || []).map((r: any) => {
      const insurerCode = r.insurer_code || '';

      const formattedQuotes = (r.quote_insurers || []).map((q: string) =>
        q.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      );

      const renewal = Array.isArray(r.quote_insurers)
        ? r.quote_insurers.includes(insurerCode)
        : false;

      return {
        policyNo: r.policy_number || '',
        policyEndDate: r.expiry_date || '',
        previousInsurer:
          this.findInsurerNameByCode(insurerCode) ||
          r.insurer_name ||
          insurerCode,
        totalInsurerQuote: r.quote_insurers?.length || 0,
        renewalQuote: renewal,
        insurerQuotes: formattedQuotes,
        vehicleType: r.vehicle_type?.split('_').join(' ') || '',
        productId: r.product_type || '',
      } as PolicyData;
    });
  }

  ngAfterContentInit(): void {
    // set minDate to today (00:00:00) and maxDate to today + 45 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minDate = today;
    const future = new Date(today);
    future.setDate(future.getDate() + 45);
    this.maxDate = future; /* ------------------------------
   USER-FRIENDLY DROPDOWN UI
   Smooth Animation + Clean Look
--------------------------------- */
  }

  /**
   * Date filter used by the datepicker to allow only dates from today to today+45 days
   */
  dateFilter = (d: Date | null): boolean => {
    if (!d) return false;
    // normalize times for comparison
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date >= this.minDate && date <= this.maxDate;
  };
  ngAfterViewInit() {
    // paginator event (already exists)
    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe((event) => {
      this.uiPageIndex = event.pageIndex;
      this.uiPageSize = event.pageSize;

      const shownUntil = (this.uiPageIndex + 1) * this.uiPageSize;

      if (shownUntil > this.buffer.length && this.apiPage < 28) {
        this.apiPage++;
        this.getDashboardRenewal(false);
      } else {
        this.updateDisplayedData();
      }
    });

    // ⭐ SORT EVENT HANDLER ⭐
    this.sort.sortChange.subscribe((sort) => {
      if (sort.active === 'totalInsurerQuote') {
        this.currentSortDirection = sort.direction;

        // reset pagination and buffer
        this.apiPage = 1;
        this.buffer = [];
        this.uiPageIndex = 0;
        this.paginator.firstPage();

        this.getDashboardRenewal(true);
      }
    });
  }

  EnterKey(event: Event, manufacture: MatDatepicker<Date>) {
    this.sharedDataService.handleEnterKey(event, manufacture);
  }
  submitMotorInsuranceTable(isValid: boolean) {
    if (!isValid) return;

    this.apiPage = 1;
    this.buffer = [];
    this.uiPageIndex = 0;

    this.paginator.firstPage();
    this.getDashboardRenewal(true); // important flag
  }

  /**
   * Open menu immediately and cancel any pending close.
   */
  openMenu(trigger: MatMenuTrigger) {
    this.cancelClose();
    try {
      if (trigger.menuOpen) return;
    } catch (e) {}

    this.openTimeout = window.setTimeout(() => {
      try {
        trigger.openMenu();
      } catch (e) {}
    }, 50);
  }

  /**
   * Start a short timeout to close the menu. This prevents flicker when moving
   * the pointer between the trigger and the menu.
   */
  startClose(trigger: MatMenuTrigger) {
    if (this.openTimeout) {
      clearTimeout(this.openTimeout as number);
      this.openTimeout = 0;
    }
    this.cancelClose();
    try {
      trigger.closeMenu();
    } catch (e) {}
  }

  /** Cancel any pending close. */
  cancelClose() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout as number);
      this.closeTimeout = 0;
    }
    if (this.openTimeout) {
      clearTimeout(this.openTimeout as number);
      this.openTimeout = 0;
    }
  }
  getInsurerList() {
    this.loader = true;
    this.apiService
      .getRequestedResponse(ApiConstants.insurer_list)
      .subscribe((insurerList) => {
        if (insurerList) {
          this.insurerList = insurerList;
          this.getDashboardRenewal();
        }
      });
  }
  getDashboardRenewal(isNewSearch: boolean = false) {
    this.loader = true;
    this.errorMessage = '';

    if (isNewSearch) {
      this.buffer = [];
      this.dataSource.data = [];
    }

    const dateValue = this.motorInsuranceTableForm.get('date')?.value;
    const formattedDate = this.datePipe.transform(dateValue, 'yyyy-MM-dd');
    const sortValue =
      this.currentSortDirection === 'asc'
        ? 1
        : this.currentSortDirection === 'desc'
        ? -1
        : -1; // default descending

    const url = `${ApiConstants.dashboard_renewal}?insurer_code=${
      this.motorInsuranceTableForm.get('policy_insurer')?.value || ''
    }&vehicle_type=${
      this.motorInsuranceTableForm.get('vehicle_type')?.value === 'All Vehicle'
        ? ''
        : this.motorInsuranceTableForm.get('vehicle_type')?.value
    }&expiry_date=${formattedDate || ''}&policy_number=${
      this.motorInsuranceTableForm.get('policy_number')?.value || ''
    }&sort=${sortValue}&page_no=${this.apiPage}`;

    this.apiService.getRequestedResponse(url).subscribe(
      (res: any) => {
        this.loader = false;

        if (res?.status && Array.isArray(res.result)) {
          const mappedData = this.mapApiResult(res.result);

          this.buffer.push(...mappedData);

          this.totalItems = res.total_pages * 100;

          this.updateDisplayedData();
        } else {
          this.loader = false;
          this.errorMessage = res?.message;
        }
      },
      (error) => {
        this.loader = false;
        this.errorMessage =
          'Something went wrong while fetching data. Please try again.';
        console.error('❌ API Error:', error);
      }
    );
  }

  updateDisplayedData() {
    const start = this.uiPageIndex * this.uiPageSize;
    const end = start + this.uiPageSize;
    this.dataSource.data = this.buffer.slice(start, end);
  }
  resetForm() {
    this.motorInsuranceTableForm.reset();
  }
}
