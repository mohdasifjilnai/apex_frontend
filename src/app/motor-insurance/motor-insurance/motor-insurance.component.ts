import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  url = 'motor';
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

  constructor(
    private router: Router,
    private apiService: ApiService,
    private sharedDataService: SharedDataService,
    private breakpointObserver: BreakpointObserver,
    private matDialog: WindowRef,
    public bottomSheet: MatBottomSheet,
    private cdr: ChangeDetectorRef
  ) {
    // if (window.innerWidth <= 768) {
    //   this.bottomSheet.open(NotCertifiedComponent);
    // } else {
    //   this.openNotCertifiedPopup(null);
    // }
  }
  ngOnInit(): void {
    this.sharedDataService.getSelectedvehicle.subscribe((res) => {
      this.vehcileType = res;
      this.motorInsurance.reset();
    });
    this.sharedDataService.detailNotFound.subscribe((res) => {
      this.vehicleNotFound = res;
      setTimeout(() => {
        this.vehicleNotFound = false;
      }, 3000);
    });

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

    let newVehicleType = sessionStorage.getItem('newVehicleType');
    if (newVehicleType) {
      sessionStorage.removeItem('newVehicleType');
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

    sessionStorage?.removeItem('gstValue');
    sessionStorage?.removeItem('renewalType');

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
    this.loader = true;
    localStorage.setItem(
      'withoutVehicleNumber',
      `${this.withoutVehicleNumber}`
    );
    // sessionStorage.setItem('policyNumber', JSON.stringify(this.isPolicyNumber));
    sessionStorage.removeItem('isPayment');
    if (!this.withoutVehicleNumber && !this.isPolicyNumber) {
      this.getVehicleDetailsInfo();
      this.motorInsurance.reset();
    } else if (!this.withoutVehicleNumber && this.isPolicyNumber) {
      this.getRenewalPolicyData();
    } else {
      let vehicleMMVValue = JSON.stringify(this.motorInsurance?.value);
      sessionStorage.setItem('vehicleMMVData', vehicleMMVValue);
      this.router.navigate(['/motor/quotes']);
    }
  }
  getVehicleNumber() {
    this.withoutVehicleNumber = !this.withoutVehicleNumber;
    this.isPolicyNumber = false;
    this.disableInsurer=true
    this.motorInsurance.reset();
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

  getRenewalPolicyData() {
    let apiUrl;
    if (this.motorInsurance.value.policy_number) {
      apiUrl = `?previous_policy_number=${this.motorInsurance.value.policy_number}`;
    } else {
      apiUrl = `?registration_number=${this.motorInsurance.value.registration_number}`;
    }

    this.apiService
      .getRequestedResponse(`${ApiConstants.get_renewal_policy}${apiUrl}`)
      .subscribe((res: any) => {
        if (res?.status) {
          this.loader = false;
          if (res.is_rb_renewal) {
            this.transactionDetails = res.transactional_details;
            sessionStorage.setItem('renewalType', 'renewal');
            let url = `/motor/quotes/proposal/${this.transactionDetails.transaction_id}/review`;
            this.router.navigate([url]);
          } else {
            this.vehicleDetailsRollover = res.vehicle_details;
            sessionStorage.setItem('renewalType', 'rollover');
            this.sharedDataService.vehicleDetailsRenewal(
              this.vehicleDetailsRollover
            );
          }
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
    this.vehicleTypeValue = localStorage.getItem('vehicleType');

    const regn_no =
      this.motorInsurance.controls['registration_number']?.value.toUpperCase();

    if (regn_no) {
      sessionStorage.setItem('registrationNumber', `${regn_no}`);

      this.sharedDataService.vehicleDetails('registrationNumber');
      this.sharedDataService.regNumberData.subscribe((numberData) => {
        if (numberData) {
          this.loader = false;
        }
      });
      this.sharedDataService.detailNotFound.subscribe((numberData) => {
        if (numberData) {
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
      resWidth = '95%';
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
    this.motorInsurance.reset();
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
}
