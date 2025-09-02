import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import moment, { Moment } from 'moment';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import {
  debounceTime,
  of,
  startWith,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
} from 'rxjs';
import { MatDatepicker } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BreadcrumbService } from 'src/app/ui/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-instant-quotation',
  templateUrl: './instant-quotation.component.html',
  styleUrls: ['./instant-quotation.component.scss'],
})
export class InstantQuotationComponent implements OnInit {
  ExpiryPolicyType: any;
  instantDetailsForm!: FormGroup;
  productTypeList: any;
  vehicleResponse: any;
  rtoSelected: any;
  rtoList: any;
  rcList: { id: number; rcName: string; value: boolean }[];
  iDKSelected: boolean = false;
  hidePreviousClaimed: boolean = false;
  regDateObj: any;
  expiryList: any;
  ncbListData: any;
  isNewVehicle: boolean = true;
  showErrorMessage: boolean = true;
  coverageType: any;
  traceIdAllData: any;
  vehicleTypeValue: any;
  policyExpiryDate: any;
  claimedList: { id: number; claimedName: string; value: boolean }[];
  mmvId: any;
  mmvList: any;
  rtoResponse: any;
  // mmvDataNotAvailable = '';
  filteredMMV!: any;
  vehicleSearchDataLength = 0;
  filteredMMVList: any[] = [];
  mmvDataNotAvailable: string = '';
  showSelectedFuelandCapacity = false;
  vehicleSelectedData: any = {};
  debounceSubjectVehcileMMV = new Subject<string>();
  showCityList = false;
  minDate: any;
  maxDate: any;
  currentDate: any;
  disableFromDate: any;
  visuallyDisabledFields: any = false;
  disabledRegistrationYear: boolean = false;
  private registrationDateSubscription!: Subscription;
  private policyExpiryDateSubscription!: Subscription;
  minDateString!: string;
  maxDateString!: string;
  urlValue = 'instantQuotation';
  registrationDateMonth: any;
  registrationDateYear: any;
  coverageList: any;
  sessionId: any;
  getAllIdData: any;
  vehicleTypeList: any;
  private destroy$ = new Subject<void>();
  lastStatus = '';
  breadcrumbLabel: any;
  responsiveData = false;
  constructor(
    private FormBuilder: FormBuilder,
    private apiservice: ApiService,
    private datePipe: DatePipe,
    private sharedata: SharedDataService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {
    this.rcList = [
      {
        id: 1,
        rcName: 'Yes',
        value: true,
      },
      {
        id: 2,
        rcName: 'No',
        value: false,
      },
    ];

    this.vehicleTypeList = [
      {
        id: 1,
        name: 'Private Car',
        value: 'private_car',
      },
      {
        id: 2,
        name: 'Two Wheeler',
        value: 'two_wheeler',
      },
    ];

    /**
     * Sample data for the Is Previous Policy Claimed dropdown list
     */
    this.claimedList = [
      {
        id: 1,
        claimedName: 'Yes',
        value: true,
      },
      {
        id: 2,
        claimedName: 'No',
        value: false,
      },
    ];
    this.debounceSubjectVehcileMMV
      .pipe(debounceTime(300))
      .subscribe((searchText) => {
        if (searchText && searchText.length > 2) {
          this.getVehicleMMV(
            searchText,
            this.instantDetailsForm.get('product_type')?.value
          );
        }
      });

    // this.currentDate = new Date();
    // this.minDate = new Date(
    //   this.currentDate.getFullYear() - 20,
    //   this.currentDate.getMonth(),
    //   this.currentDate.getDate()
    // );
    // this.disableFromDate = new Date(this.currentDate);
    // this.disableFromDate.setDate(this.disableFromDate.getDate() - 270);
    // // this.maxDate = new Date(this.currentDate);
    // // this.maxDate.setDate(this.maxDate.getDate() + 10);

    // this.maxDate = new Date(this.disableFromDate);

    this.route.queryParams.subscribe((params) => {
      this.sessionId = params['session_id'];
    });

    if (window.screen.width >= 999) {
      this.responsiveData = false;
    } else {
      this.responsiveData = true;
    }
  }

  ngOnInit(): void {
    this.instantVehicleDetails();
    this.productTypeList = [{ name: 'Private Car' }];
    this.currentDate = new Date();

    this.registrationDateSubscription = this.instantDetailsForm.controls[
      'registration_date'
    ].valueChanges.subscribe((value: any) => {
      /**
       * value' contains the selected date
       */
      /**
       * You can perform any specific action here based on the value change
       */

      if (value != null && value != '') {
        this.onRegistrationDateChange(value);
        this.getExpiringPolicy(true);
      }
    });

    this.sharedata.changePolicyExpDate
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.getExpiringPolicy(true);
        }
      });

    // this.instantDetailsForm.statusChanges.subscribe((status) => {
    //   if (status === 'VALID') {
    //     this.getcoverageType();
    //   }
    // });

    this.instantDetailsForm.statusChanges.subscribe((status) => {
      if (status === 'VALID' && this.lastStatus !== 'VALID') {
        this.lastStatus = status;
        this.getcoverageType();
      }
    });
  }

  /**
   * Initialize the form using FormBuilder
   */
  instantVehicleDetails() {
    this.instantDetailsForm = this.FormBuilder.group({
      rto_city: ['', Validators.required],
      user_car: [false],
      policy_expiry_date: [''],
      policy_expiry: [''],
      previous_claimed: [false],
      ncb_discount: [''],
      manufacture_date: [moment(), Validators.required],
      registration_date: ['', Validators.required],
      previous_insurer: [''],
      vehicle_MMV: ['', Validators.required],
      type_of_exp_policy_id: [],
      product_type: ['', Validators.required],
      req_coverage_type: [''],
      mmv_data: [''],
    });
    this.getSessionIdData(this.sessionId);
  }

  submitDetails(valid: any) {
    if (
      this.instantDetailsForm.valid &&
      this.instantDetailsForm.value.req_coverage_type
    ) {
      const registrationValue = new Date(
        this.instantDetailsForm.value.registration_date
      );
      let registrationMonth = registrationValue?.getMonth() + 1;
      let registrationYear = registrationValue?.getFullYear();
      let registrationDay = registrationValue.getDate();

      const manufactureValue = new Date(
        this.instantDetailsForm.value.manufacture_date
      );
      let manufacture_month = manufactureValue?.getMonth() + 1;
      let manufacture_year = manufactureValue?.getFullYear();
      let instantQuotesObject = {
        rb_mmv_id: this.instantDetailsForm.value.mmv_data.rb_mmv_id,
        vehicle_type: sessionStorage.getItem('vehicleType'),
        rb_rto_code: this.instantDetailsForm.value.rto_city.rb_rto_code,
        registration_day: registrationDay,
        registration_month: registrationMonth,
        registration_year: registrationYear,
        previous_insurer_code:
          this.instantDetailsForm?.value?.previous_insurer?.rb_insurer_code,
        previous_policy_exp_date: this.datePipe.transform(
          this.instantDetailsForm.value?.policy_expiry_date,
          'dd/MM/yyyy'
        ),
        previous_year_ncb:
          this.instantDetailsForm.value.ncb_discount != null
            ? this.instantDetailsForm.value.ncb_discount?.old_ncb_value
            : 0,
        is_ownership_transfer: this.instantDetailsForm.value.user_car,
        is_claimed: this.instantDetailsForm.value.previous_claimed,
        manufacture_month: manufacture_month,
        manufacture_year: manufacture_year,
        offered_ncb_value:
          this.instantDetailsForm.value?.ncb_discount != null
            ? this.instantDetailsForm.value?.ncb_discount?.new_ncb_value
            : 0,
        form_submitted: true,
        previous_policy_type: this.instantDetailsForm?.value
          .type_of_exp_policy_id
          ? this.instantDetailsForm?.value.type_of_exp_policy_id
          : null,

        session_id: JSON.parse(this.sessionId),
      };

      let sendDataForQuotes = {
        action_code: 'send_online_quotation',
        user_id: null,
        user_type: 'direct',
        direct_mobile: [this.getAllIdData.data.mobile_no],
        whatsapp_attachments: {},
        context: instantQuotesObject,
      };

      this.apiService
        .postRequestedInstantQUotes(
          ApiConstants.submit_instant_quotes,
          sendDataForQuotes
        )
        .subscribe(
          (res) => {
            if (res) {
              window.location.href = `${environment.whatsappLink}`;
            }
          },
          (error: any) => {
            // this.sendErrorProposalData(error?.error);
          }
        );
    }
  }

  /**
   *
   * @param name onExpiryPolicyChange used for expiring policy
   * @returns
   */
  onExpiryPolicyChange(value: any): void {
    // this.showErrorMessage = false;
    this.ExpiryPolicyType = value;
    if (value == 'IDK') {
      this.iDKSelected = true;
      this.instantDetailsForm.get('policy_expiry_date')?.clearValidators();
      this.instantDetailsForm.get('previous_insurer')?.clearValidators();
      this.instantDetailsForm.get('previous_claimed')?.clearValidators();
      this.instantDetailsForm.get('previous_claimed')?.setValue(false);
      this.instantDetailsForm.get('ncb_discount')?.clearValidators();
      this.instantDetailsForm.get('ncb_discount')?.reset();
      this.instantDetailsForm.get('ncb_discount')?.updateValueAndValidity();
      this.instantDetailsForm.get('previous_claimed')?.updateValueAndValidity();
      this.instantDetailsForm.get('previous_insurer')?.updateValueAndValidity();
      this.instantDetailsForm.get('previous_insurer')?.reset();
      this.instantDetailsForm
        .get('policy_expiry_date')
        ?.updateValueAndValidity();
    } else if (value == 'bundled_tp' || value == 'satp') {
      this.iDKSelected = false;
      this.hidePreviousClaimed = true;
      this.instantDetailsForm.get('previous_claimed')?.clearValidators();
      this.instantDetailsForm.get('previous_claimed')?.setValue(false);
      this.instantDetailsForm.get('ncb_discount')?.clearValidators();
      this.instantDetailsForm.get('ncb_discount')?.setValue(null);
      this.instantDetailsForm.get('ncb_discount')?.updateValueAndValidity();
      this.instantDetailsForm.get('previous_claimed')?.updateValueAndValidity();
      this.instantDetailsForm
        .get('policy_expiry_date')
        ?.setValidators([Validators.required]);
      this.instantDetailsForm
        .get('policy_expiry_date')
        ?.updateValueAndValidity();
      this.instantDetailsForm
        .get('previous_insurer')
        ?.setValidators([Validators.required]);
      this.instantDetailsForm.get('previous_insurer')?.updateValueAndValidity();
    } else if (value != '') {
      // this.getNcbList();
      this.iDKSelected = false;
      this.hidePreviousClaimed = false;
      if (!this.instantDetailsForm.value?.policy_expiry_date) {
        // this.showExpiryDateErrorMessage = true;
      }
      this.instantDetailsForm
        .get('policy_expiry_date')
        ?.setValidators([Validators.required]);
      this.instantDetailsForm
        .get('previous_insurer')
        ?.setValidators([Validators.required]);
      this.instantDetailsForm
        .get('previous_claimed')
        ?.setValidators([Validators.required]);
      this.instantDetailsForm
        .get('ncb_discount')
        ?.setValidators([Validators.required]);
      this.instantDetailsForm.get('ncb_discount')?.updateValueAndValidity();
      this.instantDetailsForm.get('previous_claimed')?.updateValueAndValidity();
      this.instantDetailsForm.get('previous_insurer')?.updateValueAndValidity();
      this.instantDetailsForm
        .get('policy_expiry_date')
        ?.updateValueAndValidity();
    }
    for (let i = 0; i <= this.expiryList?.length - 1; i++) {
      if (this.expiryList[i]?.rb_expiring_policy_type_code == value) {
        this.instantDetailsForm.value.type_of_exp_policy_id =
          this.expiryList[i]?.rb_expiring_policy_type_id;

        this.instantDetailsForm.patchValue({
          type_of_exp_policy_id: this.expiryList[i]?.rb_expiring_policy_type_id,
        });
      }
    }
  }

  getExpiringPolicy(regDateChange?: any) {
    this.vehicleTypeValue = sessionStorage.getItem('vehicleType');
    this.regDateObj = this.instantDetailsForm.get('registration_date')?.value
      ? this.datePipe.transform(
          this.instantDetailsForm.get('registration_date')?.value,
          'MM/YYYY'
        )
      : '';
    let expiry_date = this.instantDetailsForm.get('policy_expiry_date')?.value
      ? this.datePipe.transform(
          this.instantDetailsForm.get('policy_expiry_date')?.value,
          'dd/MM/YYYY'
        )
      : this.datePipe.transform(
          this.instantDetailsForm.get('registration_date')?.value,
          'dd/MM/YYYY'
        );
    let userRCtransfer = this.instantDetailsForm.value.user_car
      ? this.instantDetailsForm.value.user_car
      : false;
    let previousClaimed = this.instantDetailsForm.value.previous_claimed
      ? this.instantDetailsForm.value.previous_claimed
      : false;
    let expiringPolicyType = `?registration_date=${this.regDateObj}&vehicle_type=${this.vehicleTypeValue}&previous_policy_expiry_date=${expiry_date}&is_claimed=${previousClaimed}&is_ownership_transfer=${userRCtransfer}`;
    if (
      this.regDateObj != null &&
      this.regDateObj != '' &&
      expiry_date != null &&
      expiry_date != ''
    ) {
      this.apiservice
        .getRequestedResponse(
          `${ApiConstants.getExpiringPolicy()}${expiringPolicyType}`
        )
        ?.subscribe((res) => {
          if (res) {
            this.expiryList = res.expiring_policy_type;
            const isRbRenewal = sessionStorage.getItem('isRbRenewal');

            this.getNcbList();
          }
        });
    }
  }

  getNcbList() {
    this.apiservice
      .getRequestedResponse(ApiConstants.ncb_list())
      .subscribe((res) => {
        this.ncbListData = res;
        this.instantDetailsForm.patchValue({
          ncb_discount: this.ncbListData[0],
        });
      });
  }

  displayVehicle(data?: any) {
    if (data != null && data != 'No result found') {
      this.mmvId = data.rb_mmv_id;
      return data ? data.displayMMV : undefined;
    }
  }
  onOpened(): void {
    this.sharedata.onOpenedAutoComplete();
  }

  onClosed(): void {
    this.sharedata.onClosedAutoComplete();
  }

  /**
   *
   * @param name filterMMV used for filter MMV data
   * @returns
   */

  vehcileMMV() {
    let searchValue = this.instantDetailsForm.value.vehicle_MMV;
    this.vehicleSearchDataLength = searchValue?.length || 0;
    this.showSelectedFuelandCapacity = false;
    this.debounceSubjectVehcileMMV.next(searchValue);
  }

  getVehicleMMV(name: string, vehicletype: string) {
    let payload;
    let vehicleType = sessionStorage.getItem('vehicleType');

    payload = `product_name=${vehicleType}&search_element=${name
      .replace(/\|/g, '')
      .replace(/\s+/g, ' ')
      .trim()}`;

    this.apiservice
      .getRequestedResponse(`${ApiConstants.get_vehicle_mmv()}?${payload}`)
      .subscribe(
        (res) => {
          if (res && !res.message) {
            this.filteredMMVList = res.map((item: any) => ({
              ...item,
              displayMMV: `${item.rb_make_name} | ${item.rb_model_name} | ${item.rb_variant_name} | (${item.cubic_capacity} cc ,${item.fuel})  `,
            }));
            this.mmvDataNotAvailable = '';
          } else {
            this.filteredMMVList = [];
            this.mmvDataNotAvailable = 'No result found';
          }
        },
        () => {
          this.showSelectedFuelandCapacity = false;
        }
      );
  }

  selectVehicle(mmvData: any) {
    this.instantDetailsForm
      .get('vehicle_MMV')
      ?.setValue(
        `${mmvData.rb_make_name} | ${mmvData.rb_model_name} | ${mmvData.rb_variant_name} | (${mmvData.cubic_capacity} cc , ${mmvData.fuel}) `
      );
    this.instantDetailsForm.get('mmv_data')?.setValue(mmvData);
    this.filteredMMVList = [];
    this.showSelectedFuelandCapacity = true;
    this.vehicleSelectedData = mmvData;
  }

  vehicleComponentResponse(response: any) {
    if (typeof response !== 'object') {
      this.vehicleResponse = '';
    } else {
      this.vehicleResponse = response;
    }
  }

  vehcileRegistration() {
    let rto_code = this.instantDetailsForm.value.registration_city;
    rto_code =
      typeof rto_code === 'string'
        ? rto_code.replace(/[^a-zA-Z0-9 ]/g, '')
        : rto_code;

    this.rtoSelected = rto_code;

    // Trigger API call only for strings with at least 2 characters
    if (typeof rto_code !== 'object' && rto_code?.length >= 2) {
      const apiData = `?search_element=${rto_code}`;
      this.apiservice
        .getRequestedResponse(`${ApiConstants.get_rto_list()}${apiData}`)
        .subscribe((res) => {
          if (!res?.message) {
            this.rtoList = res;
            this.showCityList = true;
          }
        });
    } else {
      this.rtoList = [];
      this.showCityList = false;
    }
  }

  selectCity(rtoData: any) {
    this.instantDetailsForm.patchValue({
      registration_city: rtoData?.display_name,
    });
    this.showCityList = false;
  }

  hideCityList() {
    // Small delay so blur doesn't hide before click selection
    setTimeout(() => {
      this.showCityList = false;
    }, 200);
  }

  onKeyDown(event: KeyboardEvent) {
    const control = this.instantDetailsForm.get('registration_city');
    const value = control?.value;

    if (
      (event.key === 'Backspace' || event.key === 'Delete') &&
      value &&
      typeof value === 'object'
    ) {
      control?.reset();
      event.preventDefault();
    }
  }

  chosenMonthRegistration(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    let registrationDate =
      this.instantDetailsForm.controls['registration_date'].value;
    if (!registrationDate) {
      registrationDate = moment();
    } else {
      registrationDate = moment(registrationDate);
    }
    registrationDate.month(normalizedMonth.month());
    registrationDate?.year(normalizedMonth.year());
    registrationDate?.date(normalizedMonth.date());
    this.instantDetailsForm.controls['registration_date'].setValue(
      registrationDate
    );
    datepicker?.close();
  }

  /**
   * Function to handle the value change
   */
  onRegistrationDateChange(value: any): void {
    /**
     * Perform specific action based on the value change
     */
    this.sharedata.getRegistrationDate(value);
    let dateValue = value;
    const registrationDate = new Date(dateValue);
    const manufactureDate = new Date(
      registrationDate.getFullYear(),
      registrationDate.getMonth() - 1
    );
    if (manufactureDate) {
      this.instantDetailsForm.patchValue({
        manufacture_date: manufactureDate,
      });
    }
    // this.sharedata.resetManufactureDate(value);
    this.visuallyDisabledFields = this.sharedata.disableVisually(
      ['registration_date'],
      this.instantDetailsForm
    );
  }

  /**
   *
   * @param date current date
   * @param offset minimum date
   * this function used for the year validation in registartion date
   */
  getYearDateOffset(date: Date, offset: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + offset);
    return result;
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }
    const dayBeforeCurrDate = new Date(this.currentDate);
    dayBeforeCurrDate.setDate(this.currentDate.getDate() - 1);
    // Disable dates from 270 days ago to today
    return date < this.disableFromDate || date >= dayBeforeCurrDate;
    //return date < this.disableFromDate || date > this.currDate;
  };

  onRCTransferChange(value: any) {
    this.instantDetailsForm.patchValue({
      user_car: value,
    });
    this.getExpiringPolicy(true);
  }

  updateFromValidation(type: any) {
    let journeyType = type;
    if (journeyType == 'rollover') {
      // date validation
      this.currentDate = new Date();
      this.minDate = new Date(
        this.currentDate.getFullYear() - 20,
        this.currentDate.getMonth(),
        this.currentDate.getDate()
      );
      this.disableFromDate = new Date(this.currentDate);
      this.disableFromDate.setDate(this.disableFromDate.getDate() - 270);
      // this.maxDate = new Date(this.currentDate);
      // this.maxDate.setDate(this.maxDate.getDate() + 10);

      this.maxDate = new Date(this.disableFromDate);

      this.isNewVehicle = false;
      this.instantDetailsForm
        .get('previous_insurer')
        ?.setValidators([Validators.required]);
      this.instantDetailsForm.get('previous_insurer')?.updateValueAndValidity();
      this.instantDetailsForm
        .get('policy_expiry_date')
        ?.setValidators([Validators.required]);
      this.instantDetailsForm
        .get('policy_expiry_date')
        ?.updateValueAndValidity();
      this.instantDetailsForm
        .get('policy_expiry')
        ?.setValidators([Validators.required]);
      this.instantDetailsForm.get('policy_expiry')?.updateValueAndValidity();
      this.instantDetailsForm
        .get('ncb_discount')
        ?.setValidators([Validators.required]);
      this.instantDetailsForm.get('ncb_discount')?.updateValueAndValidity();
    } else {
      //   this.currentDate = new Date();
      // this.minDate = new Date(
      //   this.currentDate.getFullYear() - 20,
      //   this.currentDate.getMonth(),
      //   this.currentDate.getDate()
      // );
      // this.disableFromDate = new Date(this.currentDate);
      // this.disableFromDate.setDate(this.disableFromDate.getDate() - 270);
      // // this.maxDate = new Date(this.currentDate);
      // // this.maxDate.setDate(this.maxDate.getDate() + 10);
      this.minDate = new Date(this.currentDate);
      this.maxDate = new Date(this.currentDate);
      this.maxDate.setDate(this.maxDate.getDate() + 10);

      this.isNewVehicle = true;
      this.instantDetailsForm.get('previous_insurer')?.clearValidators();
      this.instantDetailsForm.get('previous_insurer')?.updateValueAndValidity();
      this.instantDetailsForm.get('policy_expiry_date')?.clearValidators();
      this.instantDetailsForm
        .get('policy_expiry_date')
        ?.updateValueAndValidity();
      this.instantDetailsForm.get('policy_expiry')?.clearValidators();
      this.instantDetailsForm.get('policy_expiry')?.updateValueAndValidity();
      this.instantDetailsForm.get('ncb_discount')?.clearValidators();
      this.instantDetailsForm.get('ncb_discount')?.updateValueAndValidity();
      this.instantDetailsForm.get('ncb_discount')?.setValue(null);
    }
  }

  getcoverageType() {
    let registrationDate = new Date(
      this.instantDetailsForm?.value?.registration_date
    );
    let dateObj = moment(registrationDate, 'MM/YYYY');
    let registrationMonth = moment(dateObj).month();
    this.registrationDateMonth = moment(registrationMonth + 1, 'MM').format(
      'MM'
    );
    this.registrationDateYear = moment(dateObj).year();
    let expiredDate = '';
    if (this.instantDetailsForm?.value?.policy_expiry_date) {
      let policyExpired = new Date(
        this.instantDetailsForm?.value?.policy_expiry_date
      );
      expiredDate = moment(policyExpired).format('DD/MM/YYYY');
    }
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.getCoverageType()}?reg_year=${
          this.registrationDateYear
        }&vehicle_type=${this.vehicleTypeValue}&previous_policy_type=${
          this.instantDetailsForm?.value?.policy_expiry
        }&previous_policy_expiry_date=${expiredDate}`
      )
      .subscribe((res: any) => {
        this.coverageList = res;
        this.lastStatus = '';
      });
  }

  rtoComponentResponse(response: string) {
    // Do something with the response value received from the rto component
    if (typeof response != 'object') {
      this.rtoResponse = '';
    } else {
      this.rtoResponse = response;
    }
  }

  getSessionIdData(id: any) {
    this.apiservice
      .getRequestedResponseInstant(
        `${ApiConstants.get_instant_quotes}?session_id=${id}`
      )
      ?.subscribe((res) => {
        if (res.msg == 'success') {
          this.getAllIdData = res;
          sessionStorage.setItem('vehicleType', res.data.product_type);
          if (res?.data?.business_type) {
            this.updateFromValidation(res.data.business_type);
          }

          this.instantDetailsForm.patchValue({
            product_type: res?.data?.product_type,
          });
          this.instantDetailsForm.get('product_type')?.disable();

          // 🔹 Update breadcrumb dynamically here
          const productType = res.data.product_type;
          this.breadcrumbLabel = 'Instant Quote';

          if (productType === 'private_car') {
            this.breadcrumbLabel = 'Pvt Car - Instant Quote';
          } else if (productType === 'two_wheeler') {
            this.breadcrumbLabel = 'TW - Instant Quote';
          }

          this.sharedata.changeBreadCrumb(this.breadcrumbLabel);
        }
      });
  }
}
