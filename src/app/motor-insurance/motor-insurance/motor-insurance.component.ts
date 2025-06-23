import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import city from './city-name.json';
import multi_select_city from './multi-select.json';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiConstants } from 'src/app/api.constant';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { NotCertifiedComponent } from '../../shared/components/dialog-components/not-certified/not-certified.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CheckVehicleTypeComponent } from 'src/app/shared/components/dialog-components/check-vehicle-type/check-vehicle-type.component';
import { environment } from 'src/environments/environment';
import { filter } from 'rxjs';
import { DatePipe } from '@angular/common';
declare const webengage: any;
const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-motor-insurance',

  templateUrl: './motor-insurance.component.html',
  styleUrls: ['./motor-insurance.component.scss'],
  animations: [
    trigger('slideUp', [
      state('void', style({ transform: 'translateY(100%)', opacity: 0 })),
      transition(':enter, :leave', [animate('0.5s ease-in-out')]),
    ]),
  ],
})
export class MotorInsuranceComponent implements OnInit {
  cities: any = city;
  multi_select_cities: any = multi_select_city;
  withoutVehicleNumber: boolean = false;
  vehcileType = 'private_car';
  vehicleTypeValue: any;
  registrationMonth: any;
  currentMonthValue: any;
  insurerDisable = false;
  disableInsurer: boolean = true;
  vehicleNotFound: any;
  notSureHide = true;
  isPolicyNumber: boolean = false;
  loader: boolean = false;
  vehicleCheck = false;
  url = 'motor';
  isCheckWheeler: boolean = true;
  traceId: any;
  vaahanName: any;
  vehicleDetailsJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: CheckVehicleTypeComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: '5%',
    isOutSideClose: true,
    classObtained: 'vehicle-details-class',
  };

  motorInsurance: FormGroup = new FormGroup({
    registration_number: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(14),
    ]),
    vehicle: new FormControl(''),
    rto_city: new FormControl(''),
    registration_date: new FormControl(''),
    previous_insurer: new FormControl(''),
    policy_expiry_date: new FormControl(''),
    policy_number: new FormControl(''),
  });
  notCertifiedComponentJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: NotCertifiedComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'not-certifiedComponent-class',
  };

  rtoResponse: any;
  vehicleResponse: any;
  previousInsurerResponse: any;
  policyNumber: any;
  transactionDetails: any;
  vehicleDetailsRollover: any;
  checkWheeler: any;
  devUrl: boolean = false;
  fullUrl: any;
  is_cse: any;
  employee_code: any;
  cse: any;
  partner_code: any;
  isPartnerPOSStatus: boolean = false;
  regNo: any;
  partnerCodeData: any;
  policyNo: any;
  cvVehicleTypeList: any;
  selectedvehicleType: any;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private sharedDataService: SharedDataService,
    private breakpointObserver: BreakpointObserver,
    private matDialog: WindowRef,
    public bottomSheet: MatBottomSheet,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // if (window.innerWidth <= 768) {
    //   this.bottomSheet.open(NotCertifiedComponent);
    // } else {
    //   this.openNotCertifiedPopup(null);
    // }
  }
  ngOnInit(): void {
    webengage.track('Motor_Journey_Initiated', {});
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.fullUrl = this.removeLastSegment(window.location.href);
      });

    this.fullUrl = this.removeLastSegment(window.location.href);
    // console.log(environment?.apex);

    if (this.fullUrl + '/' != 'https://apex.renewbuyinsurance.com/') {
      this.devUrl = true;
    }
    this.route.queryParams.subscribe((params) => {
      const policyNumber = params['policy_number'];
      const source = params['source'];

      sessionStorage.setItem('source', source);
    });
    //  else if (environment?.apex_local === this.fullUrl + '/') {
    //   this.devUrl = true;
    // } else if (environment?.apexD2C === this.fullUrl + '/') {
    //   this.devUrl = true;
    // }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.sharedDataService.getSelectedvehicle.subscribe((res) => {
      this.vehcileType = res;
      this.selectedvehicleType = res;
      if (res == 'commercial_vehicle') {
        // this.commercialVehicleTypeList();
        this.motorInsurance
          .get('cv_vehicle_type')
          ?.setValidators([Validators.required]);
      } else {
        this.motorInsurance.get('cv_vehicle_type')?.setValidators([]);
        this.motorInsurance.get('cv_vehicle_type')?.updateValueAndValidity();
      }
      this.motorInsurance.reset();
    });
    this.sharedDataService.detailNotFound.subscribe((res) => {
      this.vehicleNotFound = res;
      setTimeout(() => {
        this.vehicleNotFound = false;
      }, 3000);
    });
    this.is_cse = sessionStorage.getItem('is_cse')?.toLowerCase();
    this.employee_code = sessionStorage.getItem('employee_code');
    this.partner_code = sessionStorage.getItem('partner_code');
    const partner_code = sessionStorage.getItem('partner_code')?.slice(0, 2);
    if (partner_code != 'EM') {
      const pos_status = sessionStorage.getItem('pos_status')?.toLowerCase();
      for (let i = 0; i < environment?.partnerswithoutPOS.length; i++) {
        if (environment?.partnerswithoutPOS[i] === this.partner_code) {
          this.isPartnerPOSStatus = true;
          break;
        }
      }
      if (pos_status == 'false' && !this.isPartnerPOSStatus) {
        this.openNotCertifiedPopup('');
      }
    }

    this.sharedDataService.registrationMonthSelection.subscribe((res) => {
      const start = new Date();
      const end = new Date(res.value);
      let monthGap = this.monthDiff(start, end);

      if (monthGap >= 10) {
        this.insurerDisable = false;
        this.disableInsurer = this.insurerDisable;
        this.sharedDataService.insurerData(this.insurerDisable);
        if (!this.motorInsurance.get('previous_insurer')) {
          this.motorInsurance.addControl(
            'previous_insurer',
            new FormControl('')
          );
          this.motorInsurance.addControl(
            'policy_expiry_date',
            new FormControl('')
          );
        }
        this.motorInsurance
          .get('previous_insurer')
          ?.setValidators([Validators.required]);
        this.motorInsurance.get('previous_insurer')?.updateValueAndValidity();
        this.motorInsurance
          .get('policy_expiry_date')
          ?.setValidators([Validators.required]);
        this.motorInsurance.get('policy_expiry_date')?.updateValueAndValidity();
      } else {
        this.insurerDisable = true;
        this.disableInsurer = this.insurerDisable;

        this.sharedDataService.insurerData(this.insurerDisable);
      }
    });
    let regnNumberValue = sessionStorage.getItem('registrationNumber');
    if (regnNumberValue) {
      sessionStorage.removeItem('registrationNumber');
    }
    sessionStorage.removeItem('pageLoad');
    sessionStorage.removeItem('renewalRTOData');
    sessionStorage.removeItem('renewalmmvData');
    sessionStorage.removeItem('renewalPolicyExpiry');
    sessionStorage.removeItem('renewalPreviousInsurer');
    sessionStorage.removeItem('checkWheeler');
    sessionStorage.removeItem('proposal_punched');
    sessionStorage.removeItem('quotesUrl');
    sessionStorage.removeItem('sharable_transactionData');
    sessionStorage.removeItem('previousInsurerCode');
    sessionStorage.removeItem('isprevoiusInsurer');
    sessionStorage.removeItem('RenewalPreviousDetails');
    sessionStorage.removeItem('mmvId');
    sessionStorage.removeItem('previousInsurer');
    sessionStorage.removeItem('registrationDetails');
    sessionStorage.removeItem('coverageType');
    sessionStorage.removeItem('alreadyCalled');
    sessionStorage.removeItem('isRbRenewal');
    sessionStorage.removeItem('BuyNowClick');
    let selectedAddons = sessionStorage.getItem('selectedAddons');
    if (selectedAddons) {
      sessionStorage.removeItem('selectedAddons');
    }
    let vehicleMMVData = sessionStorage.getItem('vehicleMMVData');
    if (vehicleMMVData) {
      sessionStorage.removeItem('vehicleMMVData');
    }
    let vehiclePopup = sessionStorage.getItem('vehiclePopup');
    if (vehiclePopup) {
      sessionStorage.removeItem('vehiclePopup');
    }
    let vehicleMMV = sessionStorage.getItem('mmv_data');
    if (vehicleMMV) {
      sessionStorage.removeItem('mmv_data');
    }
    sessionStorage.removeItem('lastSelectedTabIndex');
    let newVehicleType = sessionStorage.getItem('newVehicleType');
    if (newVehicleType) {
      sessionStorage.removeItem('newVehicleType');
    }
    let renewalPolicyNumber = sessionStorage.getItem('renewalPolicyNumber');
    if (renewalPolicyNumber) {
      sessionStorage.removeItem('renewalPolicyNumber');
    }
    let planType = sessionStorage.getItem('planType');
    if (planType) {
      sessionStorage.removeItem('planType');
    }

    let transaction_id = sessionStorage.getItem('transaction_id');
    if (transaction_id) {
      sessionStorage.removeItem('transaction_id');
    }

    let idvData = sessionStorage.getItem('idvData');
    if (idvData) {
      sessionStorage.removeItem('idvData');
    }

    let productTypeValue = sessionStorage.getItem('productType');
    if (productTypeValue) {
      sessionStorage.removeItem('productType');
    }

    let proposalTypeData = sessionStorage.getItem('proposerType');
    if (proposalTypeData) {
      sessionStorage.removeItem('proposerType');
    }
    let proposalParam = sessionStorage.getItem('proposal_param');
    if (proposalParam) {
      sessionStorage.removeItem('proposal_param');
    }
    let proposalId = sessionStorage.getItem('proposal_Id');
    if (proposalId) {
      sessionStorage.removeItem('proposal_Id');
    }

    let quote_data = sessionStorage.getItem('quotes_data');
    if (quote_data) {
      sessionStorage.removeItem('quotes_data');
    }
    let insurerCode = sessionStorage.getItem('insurer_code');
    if (insurerCode) {
      sessionStorage.removeItem('insurer_code');
    }
    let kycData = sessionStorage.getItem('kycData');
    if (kycData) {
      sessionStorage.removeItem('kycData');
    }

    let sortObjectkey = sessionStorage.getItem('sortObjectkey');
    if (sortObjectkey) {
      sessionStorage.removeItem('sortObjectkey');
    }
    let customer_mobile_number = sessionStorage.getItem(
      'customer_mobile_number'
    );
    if (customer_mobile_number) {
      sessionStorage.removeItem('customer_mobile_number');
    }

    let renewalDetails = sessionStorage.getItem('renewalDetails');
    if (renewalDetails) {
      sessionStorage.removeItem('renewalDetails');
    }
    let previous_insurerCode = sessionStorage.getItem('previous_insurerCode');
    if (previous_insurerCode) {
      sessionStorage.removeItem('previous_insurerCode');
    }
    let mmvData = sessionStorage.getItem('mmvData');
    if (mmvData) {
      sessionStorage.removeItem('mmvData');
    }

    let registration_form_isValid = sessionStorage.getItem(
      'registration_form_isValid'
    );
    if (registration_form_isValid) {
      sessionStorage.removeItem('registration_form_isValid');
    }
    let isCKycDOne = sessionStorage.getItem('isCKycDOne');
    if (isCKycDOne) {
      sessionStorage.removeItem('isCKycDOne');
    }
    let quoteRequesId = sessionStorage.getItem('quote_request_id');
    if (quoteRequesId) {
      sessionStorage.removeItem('quote_request_id');
    }
    let currentUrl = sessionStorage.getItem('current_url');
    if (currentUrl) {
      sessionStorage.removeItem('current_url');
    }
    sessionStorage.removeItem('isPayment');

    sessionStorage?.removeItem('gstValue');
    sessionStorage?.removeItem('renewalType');
    sessionStorage.removeItem('pageRefresh');
    sessionStorage.removeItem('allNCBDataProposal');
    sessionStorage.removeItem('partnerCodeTraceId');

    this.motorInsurance.controls['registration_number'].valueChanges.subscribe(
      (val: any) => {
        if (val && this.vehicleNotFound) {
          this.vehicleNotFound = '';
        }
      }
    );

    this.motorInsurance.controls['policy_expiry_date'].valueChanges.subscribe(
      (val: any) => {
        if (val == 'Not Sure') {
          this.notSureHide = false;
        } else {
          this.notSureHide = true;
        }
      }
    );
    this.sharedDataService.checkVehicleType.subscribe((res) => {
      if (res) {
        this.checkWheeler = JSON.parse(
          sessionStorage.getItem('checkWheeler') || '{}'
        );
        if (
          this.checkWheeler &&
          Object.keys(this.checkWheeler).length > 0 &&
          !this.vehicleCheck
        ) {
          this.isCheckWheeler = res.isCheckWheeler;
          this.vaahanName = res.vaahanName;
          this.vehicleCheck = true;
          this.openVehicleDetailsPopup(null);
        }
      }
    });
    // Extract the base URL
    const currentBaseUrl = window.location.href;
    const url = new URL(currentBaseUrl);
    const hostParts = url.host.split('.');
    let subdomain = hostParts[0];
    // if(subdomain=='d2c'){
    //   sessionStorage.setItem('vehiclePopup', 'true');
    // }else{
    //   sessionStorage.setItem('vehiclePopup', 'false');
    // }
    let vehicleTypeValue = sessionStorage.getItem('vehicleType');
    if (!vehicleTypeValue) {
      sessionStorage.setItem('vehicleType', `private_car`);
    }
    this.route.queryParamMap.subscribe((params) => {
      this.regNo = params.get('reg_no');
      let userid: any = params.get('userid');
      sessionStorage.setItem('userid', userid);
      let mobile_number: any = params.get('mobile_no');
      if (mobile_number != null) {
        sessionStorage.setItem('customer_mobile_number', mobile_number);
      }
      this.policyNo = params.get('policy_number');
      if (this.regNo != null) {
        let value = this.regNo;
        value = value.replace(/\s/g, '');
        const sanitizedValue = value.replace(/-/g, '');
        if (sanitizedValue.length < 7) {
          const formattedValue = sanitizedValue.replace(/(.{2})/g, '$1-');
          value = formattedValue.replace(/-$/, '');
        } else {
          const prefix = sanitizedValue.substring(0, 2);
          const prefix2 = sanitizedValue.substring(2, 4);
          const postfix = sanitizedValue.substring(4);
          const formattedPostfix = postfix.replace(
            /([A-Za-z]+|[0-9]+)/g,
            '$1-'
          );
          value = `${prefix}-${prefix2}-${formattedPostfix.replace(/-$/, '')}`;
        }
        value = value.replace(/^-|-$/g, '');
        value = value.replace(/--+/g, '-');
        this.regNo = value;
        this.getVehicleDetails();
      } else if (this.policyNo != null) {
        this.motorInsurance.patchValue({
          policy_number: this.policyNo,
        });
        this.isPolicyNumber = true;
        this.getVehicleDetails();
      }
    });
  }
  monthDiff = (d1: any, d2: any) => {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();

    return Math.abs(months);
  };

  isResponsive(): boolean {
    return this.breakpointObserver.isMatched('(max-width: 767px)');
  }
  rtoComponentResponse(response: string) {
    // Do something with the response value received from the rto component
    if (typeof response != 'object') {
      this.rtoResponse = '';
    } else {
      this.rtoResponse = response;
    }
  }
  vehicleComponentResponse(response: string) {
    // Do something with the response value received from the rto component
    if (typeof response != 'object') {
      this.vehicleResponse = '';
    } else {
      this.vehicleResponse = response;
    }
  }
  previousInsurerComponentResponse(response: string) {
    if (typeof response != 'object') {
      this.previousInsurerResponse = '';
      this.motorInsurance.setErrors({ invalidResponse: true });
    } else {
      this.previousInsurerResponse = response;
    }
  }
  /**
   * get vehicle detials submit event
   */

  getVehicleDetails() {
    if (this.vehcileType == 'commercial_vehicle') {
      this.postTraceIdCommercialVehicle();
    } else {
      this.getTraceId();
    }
  }
  getVehicleNumber() {
    this.withoutVehicleNumber = !this.withoutVehicleNumber;
    sessionStorage.removeItem('registrationNumber');
    let vehicleTypeValue = sessionStorage.getItem('vehicleType');
    if (!vehicleTypeValue) {
      sessionStorage.setItem('vehicleType', `private_car`);
    }
    if (this.withoutVehicleNumber) {
      let vehicleTypeValue = sessionStorage.getItem('vehicleType');

      webengage.track('Proceed_Without_Vehicle_Number_Clicked', {
        User_Type: sessionStorage.getItem('partner_code')
          ? 'Partner'
          : 'Customer',
        Motor_Type: vehicleTypeValue,
      });
    }
    this.isPolicyNumber = false;
    this.disableInsurer = true;
    this.motorInsurance.reset();
    this.vehicleResponse = null;
    this.rtoResponse = null;
    if (this.withoutVehicleNumber) {
      setTimeout(() => {
        this.motorInsurance.get('registration_number')?.setValidators([]);
        this.motorInsurance.get('registration_number')?.clearValidators();
        this.motorInsurance
          .get('registration_number')
          ?.updateValueAndValidity();
        this.motorInsurance.get('policy_number')?.setValidators([]);
        this.motorInsurance.get('policy_number')?.clearValidators();
        this.motorInsurance.get('policy_number')?.updateValueAndValidity();
        this.motorInsurance
          .get('vehicle')
          ?.setValidators([Validators.required]);
        this.motorInsurance.get('vehicle')?.updateValueAndValidity();
        this.motorInsurance
          .get('rto_city')
          ?.setValidators([Validators.required]);
        this.motorInsurance.get('rto_city')?.updateValueAndValidity();
        this.motorInsurance
          .get('registration_date')
          ?.setValidators([Validators.required]);
        this.motorInsurance.get('registration_date')?.updateValueAndValidity();
        sessionStorage.removeItem('checkWheeler');
      }, 0);
      this.cdr.detectChanges();
    } else {
      setTimeout(() => {
        this.motorInsurance
          .get('registration_number')
          ?.setValidators([Validators.required]);
        this.motorInsurance
          .get('registration_number')
          ?.updateValueAndValidity();
        this.motorInsurance.get('policy_number')?.setValidators([]);
        this.motorInsurance.get('policy_number')?.clearValidators();
        this.motorInsurance.get('policy_number')?.updateValueAndValidity();
        this.motorInsurance.get('vehicle')?.setValidators([]);
        this.motorInsurance.get('vehicle')?.clearValidators();
        this.motorInsurance.get('vehicle')?.updateValueAndValidity();
        this.motorInsurance.get('rto_city')?.setValidators([]);
        this.motorInsurance.get('rto_city')?.clearValidators();
        this.motorInsurance.get('rto_city')?.updateValueAndValidity();
        this.motorInsurance.get('registration_date')?.setValidators([]);
        this.motorInsurance.get('registration_date')?.clearValidators();
        this.motorInsurance.get('registration_date')?.updateValueAndValidity();
      }, 0);
      this.cdr.detectChanges();
    }
  }
  removeLastSegment(url: string): string {
    const urlObj = new URL(url);
    urlObj.pathname = urlObj.pathname.replace(/\/[^\/]*$/, '');
    return urlObj.origin;
  }

  /** function for renewal journey */
  getRenewalPolicyData() {
    let apiUrl;
    if (this.motorInsurance.value.policy_number) {
      apiUrl = `?previous_policy_number=${this.motorInsurance.value.policy_number.toUpperCase()}`;
    } else {
      apiUrl = `?registration_number=${this.motorInsurance.value.registration_number.toUpperCase()}`;
    }
    let vehicleTypeValue = sessionStorage.getItem('vehicleType');
    webengage.track('Renewal_Process_Initiated', {
      Registration_Number: this.motorInsurance.value.registration_number,
      User_Type: sessionStorage.getItem('partner_code')
        ? 'Partner'
        : 'Customer',
      Motor_Type: vehicleTypeValue,
      Policy_Number: this.motorInsurance.value.policy_number,
    });
    this.apiService
      .getRequestedResponse(`${ApiConstants.get_renewal_policy}${apiUrl}`)
      .subscribe((res: any) => {
        if (res?.status) {
          this.sharedDataService.getRenewalData(res);
          this.loader = false;
          if (res?.vehicle_details?.is_two_wheeler) {
            sessionStorage.setItem('vehicleType', 'two_wheeler');
          } else if (res?.vehicle_details?.is_four_wheeler) {
            sessionStorage.setItem('vehicleType', 'private_car');
          }
          if (res?.is_rb_renewal) {
            sessionStorage.setItem('renewalType', 'renewal');
          }
          const vehicleDetails = res?.vehicle_details;
          if (vehicleDetails) {
            this.sharedDataService.vehicleDetailsRenewal(vehicleDetails);
            this.sharedDataService.renewalDataResponse(res)
          }
          sessionStorage.setItem('mmvId', res?.vehicle_details?.rb_mmv_id);
          sessionStorage.setItem('RenewalPreviousDetails', JSON.stringify(res));
          sessionStorage.setItem(
            'coverageType',
            JSON.stringify(
              res?.previous_policy_details?.previous_policy_details
                ?.renewal_coverage_type
            )
          );
          sessionStorage.setItem(
            'renewalPolicyNumber',
            res?.previous_policy_details?.previous_policy_details?.policy_no
          );
          sessionStorage.setItem(
            'previousInsurer',
            res?.vehicle_details?.previous_insurer_code
          );
          this.partnerCodeData = sessionStorage.getItem('partnerCodeTraceId');
          const parsedValue = JSON.parse(this.partnerCodeData);
          this.traceId = parsedValue?.trace_id;

          this.router.navigate([`quotes/${this.traceId}`]);
          if (
            res?.previous_policy_details?.vehicle_details?.registration_no !=
            null
          ) {
            sessionStorage.setItem(
              'registrationNumber',
              res?.previous_policy_details?.vehicle_details?.registration_no
            );
          }

          sessionStorage.setItem(
            'previousInsurerCode',
            res?.previous_policy_details?.insurer_code
          );
          sessionStorage.setItem(
            'coverageType',
            JSON.stringify(
              res?.previous_policy_details?.previous_policy_details
                ?.renewal_coverage_type
            )
          );
          sessionStorage.setItem('isRbRenewal', res?.is_rb_renewal);

          // if (res.transactional_details && res?.ckyc_status) {
          //   this.transactionDetails = res.transactional_details;
          //   sessionStorage.setItem('renewalType', 'renewal');
          //   // let url = `quotes/proposal/${this.transactionDetails.transaction_id}/review`;
          //   let url = `quotes/${this.transactionDetails.transaction_id}/`;
          //   this.router.navigate([url]);
          // } else if (res.transactional_details && !res?.ckyc_status) {
          //   this.transactionDetails = res.transactional_details;
          //   sessionStorage.setItem('renewalDetails', JSON.stringify(res));
          //   sessionStorage.setItem('renewalType', 'renewal');
          //   // let url = `quotes/proposal/${this.transactionDetails.transaction_id}`;
          //   let url = `quotes/${this.transactionDetails.transaction_id}/`;
          //   this.router.navigate([url]);
          // } else {
          //   this.vehicleDetailsRollover = res.vehicle_details;
          //   sessionStorage.setItem('renewalType', 'rollover');
          //   this.sharedDataService.vehicleDetailsRenewal(
          //     this.vehicleDetailsRollover
          //   );
          // }
        } else {
          this.sharedDataService.openSnackBar(res?.error_message, false, 3000);
          this.loader = false;
        }
      });
  }
  /**
   * Retrieves vehicle details information by making a request to the API with a specific registration number.
   * Uses the ApiService to fetch the requested response and subscribes to the observable.
   */

  getVehicleDetailsInfo() {
    this.vehicleTypeValue = sessionStorage.getItem('vehicleType');

    const regn_no =
      this.motorInsurance.controls['registration_number']?.value.toUpperCase();

    if (regn_no) {
      sessionStorage.setItem('registrationNumber', `${regn_no}`);

      this.sharedDataService.vehicleDetails('registrationNumber');
      this.sharedDataService.regNumberData.subscribe(
        (numberData) => {
          if (numberData) {
            this.loader = false;
          }
        },
        (error) => {
          this.loader = false;
        }
      );
      this.sharedDataService.detailNotFound.subscribe((numberData) => {
        if (numberData) {
          this.loader = false;
        }
      });
      this.sharedDataService.loader.subscribe((data) => {
        if (data) {
          this.loader = false;
        }
      });
    }
  }
  /**
   * this fucntion use open Not Certified Popup modal
   */
  openNotCertifiedPopup(ObjData: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = 'auto';
      resTop = '5%';
    } else {
      resWidth = 'auto';
      resTop = '5%';
    }

    const obj: any = {
      modalName: this.notCertifiedComponentJSON['modalName'],
      width: this.notCertifiedComponentJSON['widthObtained'],
      height: this.notCertifiedComponentJSON['heightObtained'],
      classNameObtained: this.notCertifiedComponentJSON['classObtained'],
      isOutSideClose: this.notCertifiedComponentJSON['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: ObjData,
        top: resTop,
      },
    };

    this.matDialog.openDialog(obj);
  }
  /**
   * Switches between the registration number and policy number fields as the primary field for the user to enter.
   *
   * @remarks
   * The policy number field is only available when the "I don't know my policy number" option is selected.
   * When the policy number field is active, the user is required to enter a policy number to continue.
   * When the registration number field is active, the user is required to enter a registration number to continue.
   * If the user enters an invalid policy number, an error message is displayed.
   */
  getPolicyNumber() {
    this.isPolicyNumber = !this.isPolicyNumber;
    if (this.isPolicyNumber) {
      webengage.track('Motor_Renew_Initiated', {
        User_Type: sessionStorage.getItem('partner_code')
          ? 'Partner'
          : 'Customer',
      });
    }
    this.motorInsurance.reset();
    this.vehicleResponse = null;
    this.rtoResponse = null;
    if (this.isPolicyNumber) {
      setTimeout(() => {
        this.motorInsurance
          .get('registration_number')
          ?.setValidators([Validators.required]);
        this.motorInsurance
          .get('registration_number')
          ?.updateValueAndValidity();
        this.motorInsurance
          .get('policy_number')
          ?.setValidators([Validators.required]);
        this.motorInsurance.get('policy_number')?.updateValueAndValidity();
        this.motorInsurance
          .get('policy_number')
          ?.valueChanges.subscribe((value) => {
            if (value) {
              this.motorInsurance.get('registration_number')?.reset();
              this.motorInsurance.get('registration_number')?.setValidators([]);
              this.motorInsurance.get('registration_number')?.clearValidators();
              this.motorInsurance
                .get('registration_number')
                ?.updateValueAndValidity();
            }
          });

        this.motorInsurance
          .get('registration_number')
          ?.valueChanges.subscribe((value) => {
            if (value) {
              this.motorInsurance.get('policy_number')?.reset();
              this.motorInsurance.get('policy_number')?.setValidators([]);
              this.motorInsurance.get('policy_number')?.clearValidators();
              this.motorInsurance
                .get('policy_number')
                ?.updateValueAndValidity();
            }
          });
        this.motorInsurance.get('vehicle')?.setValidators([]);
        this.motorInsurance.get('vehicle')?.updateValueAndValidity();
        this.motorInsurance.get('rto_city')?.setValidators([]);
        this.motorInsurance.get('rto_city')?.updateValueAndValidity();
        this.motorInsurance.get('registration_date')?.setValidators([]);
        this.motorInsurance.get('registration_date')?.updateValueAndValidity();
      }, 0);
    } else {
      setTimeout(() => {
        this.motorInsurance
          .get('registration_number')
          ?.setValidators([Validators.required]);
        this.motorInsurance
          .get('registration_number')
          ?.updateValueAndValidity();
        this.motorInsurance.get('policy_number')?.setValidators([]);
        this.motorInsurance.get('policy_number')?.clearValidators();
        this.motorInsurance.get('policy_number')?.updateValueAndValidity();
        // this.motorInsurance
        //   .get('vehicle')
        //   ?.setValidators([Validators.required]);
        // this.motorInsurance.get('vehicle')?.updateValueAndValidity();
        // this.motorInsurance
        //   .get('rto_city')
        //   ?.setValidators([Validators.required]);
        // this.motorInsurance.get('rto_city')?.updateValueAndValidity();
        // this.motorInsurance
        //   .get('registration_date')
        //   ?.setValidators([Validators.required]);
        // this.motorInsurance.get('registration_date')?.updateValueAndValidity();
      }, 0);
    }
  }
  addRequiredValidator(controlName: string) {
    const control = this.motorInsurance.get(controlName);
    if (control && !control.validator) {
      control.setValidators([Validators.required]);
      control.updateValueAndValidity();
    }
  }

  openVehicleDetailsPopup(ObjData: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = 'auto';
      resTop = '5%';
    } else {
      resWidth = 'auto';
      resTop = '5%';
    }

    const obj: any = {
      modalName: this.vehicleDetailsJSON['modalName'],
      width: this.vehicleDetailsJSON['widthObtained'],
      height: this.vehicleDetailsJSON['heightObtained'],
      classNameObtained: this.vehicleDetailsJSON['classObtained'],
      isOutSideClose: this.vehicleDetailsJSON['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: ObjData,
        top: resTop,
      },
    };

    this.matDialog.openDialog(obj);
  }

  getTraceId() {
    this.loader = true;
    let apiUrl;
    this.partner_code = sessionStorage.getItem('partner_code')
      ? sessionStorage.getItem('partner_code')
      : '';

    apiUrl = `?partner_code=${this.partner_code}`;
    let vehicleTypeValue = sessionStorage.getItem('vehicleType');
    if (this.motorInsurance.value.registration_number) {
      webengage.track('Motor_Quotes_Initiated', {
        Registration_Number: this.motorInsurance.value.registration_number,
        User_Type: sessionStorage.getItem('partner_code')
          ? 'Partner'
          : 'Customer',
        Motor_Type: vehicleTypeValue,
      });
    } else if (
      this.motorInsurance.value.vehicle?.rb_mmv_id &&
      this.motorInsurance.value?.policy_expiry_date != 'Not Sure'
    ) {
      const transformedRegDate = this.motorInsurance.value?.registration_date
        ? this.datePipe.transform(
            this.motorInsurance.value?.registration_date,
            'yyyy-MM-ddTHH:mm:ss.SSSZ'
          )
        : '';

      let regDate = transformedRegDate
        ? new Date(transformedRegDate as string)
        : '';
      const transformedPolicyDate = this.motorInsurance.value
        ?.policy_expiry_date
        ? this.datePipe.transform(
            this.motorInsurance.value?.policy_expiry_date,
            'yyyy-MM-ddTHH:mm:ss.SSSZ'
          )
        : '';

      let policyDate = transformedPolicyDate
        ? new Date(transformedPolicyDate as string)
        : '';

      let submitDetails = {
        Search_Vehicle: this.motorInsurance.value.vehicle?.displayMMV,
        Search_RTO_City: this.motorInsurance.value.rto_city?.display_name,
        Select_Registration_Date: regDate,
        Select_Policy_Expiry_Date: policyDate,
        Search_Previous_Insurance_Name:
          this.motorInsurance.value.previous_insurer?.rb_insurer_name,
        User_Type: sessionStorage.getItem('partner_code')
          ? 'Partner'
          : 'Customer',
        Motor_Type: vehicleTypeValue,
      };
      const filteredSubmitData = Object.fromEntries(
        Object.entries(submitDetails).filter(([key, value]) => {
          if (value == null || value === '') {
            return false;
          }
          return true;
        })
      );
      webengage.track(
        'Proceed_Without_Vehicle_Number_Details_Submitted',
        filteredSubmitData
      );
    }

    const data = {
      partner_code: this.partner_code,
      bussiness_type:this.motorInsurance.value?.policy_expiry_date==null?'new':'renewal',
      quotes_data: this.motorInsurance.value,
    };
    if(this.motorInsurance.value?.registration_number!=null){
      data.bussiness_type='renewal'
    }
    this.apiService
      .postRequestedResponse(`${ApiConstants.get_trace_Id()}${apiUrl}`, data)
      .subscribe(
        (res: any) => {
          this.traceId = res.trace_id;
          this.sharedDataService.getTraceIdDetails(res);
          sessionStorage.setItem('partnerCodeTraceId', JSON.stringify(res));
          this.loader = true;
          if (this.vehicleCheck) {
            this.vehicleCheck = false;
          }
          sessionStorage.setItem(
            'withoutVehicleNumber',
            `${this.withoutVehicleNumber}`
          );
          sessionStorage.setItem('quotesUrl', 'true');
          let vehicleTypeValue = sessionStorage.getItem('vehicleType');
          if (!vehicleTypeValue) {
            sessionStorage.setItem('vehicleType', `private_car`);
          }
          // sessionStorage.setItem('policyNumber', JSON.stringify(this.isPolicyNumber));
          sessionStorage.removeItem('isPayment');
          if (!this.withoutVehicleNumber && !this.isPolicyNumber) {
            this.getVehicleDetailsInfo();
            // this.motorInsurance.reset();
          } else if (this.isPolicyNumber) {
            this.getRenewalPolicyData();
          } else {
            let vehicleMMVValue = JSON.stringify(this.motorInsurance?.value);
            sessionStorage.setItem('vehicleMMVData', vehicleMMVValue);
            this.router.navigate([`quotes/${this.traceId}`]);
          }
        },
        (error) => {
          this.loader = false;
        }
      );
  }

  postTraceIdCommercialVehicle() {
    let apiUrl;
    this.partner_code = sessionStorage.getItem('partner_code')
      ? sessionStorage.getItem('partner_code')
      : '';

    apiUrl = `?partner_code=${this.partner_code}`;
    const data = {
      partner_code: this.partner_code,
      quotes_data: this.motorInsurance.value,
    };
    this.apiService
      .postRequestedResponse(`${ApiConstants.get_trace_Id()}${apiUrl}`, data)
      .subscribe(
        (res: any) => {
          this.traceId = res.trace_id;
          this.sharedDataService.getTraceIdDetails(res);
          sessionStorage.setItem('partnerCodeTraceId', JSON.stringify(res));
          this.loader = true;
          if (this.vehicleCheck) {
            this.vehicleCheck = false;
          }
          sessionStorage.setItem(
            'withoutVehicleNumber',
            `${this.withoutVehicleNumber}`
          );
          sessionStorage.setItem('quotesUrl', 'true');

          // sessionStorage.setItem('policyNumber', JSON.stringify(this.isPolicyNumber));
          sessionStorage.removeItem('isPayment');
          if (!this.withoutVehicleNumber && !this.isPolicyNumber) {
            this.getVehicleDetailsInfo();
            // this.motorInsurance.reset();
          } else if (this.isPolicyNumber) {
            this.getRenewalPolicyData();
          } else {
            let vehicleMMVValue = JSON.stringify(this.motorInsurance?.value);
            sessionStorage.setItem('vehicleMMVData', vehicleMMVValue);
            this.router.navigate([`quotes/${this.traceId}`]);
          }
        },
        (error) => {
          this.loader = false;
        }
      );
  }
  /**
   * Commercial Vehicle Api Integrations
   */

  // commercialVehicleTypeList() {
  //   this.apiService
  //     .getRequestedResponse(`${ApiConstants.cv_vehicle_type}`)
  //     .subscribe((res: any) => {
  //       this.cvVehicleTypeList = res;
  //     });
  // }

  onVehicleTypeSelect(event: any) {
    const selectedVehicle = event.value;
    this.sharedDataService.selectedVehicleTypeObject(selectedVehicle);
  }
}
