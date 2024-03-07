import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
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
  motorInsurance: FormGroup = new FormGroup({
    registration_number: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(14)
    ]),
    vehicle: new FormControl(''),
    rto_city: new FormControl(''),
    registration_date: new FormControl(moment()),
    previous_insurer: new FormControl(''),
    policy_expiry_date: new FormControl(''),
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
    widthObtained: '75%',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'not-certifiedComponent-class',
  };
  constructor(
    private router: Router,
    private apiService: ApiService,
    private sharedDataService: SharedDataService,
    private breakpointObserver: BreakpointObserver,
    private matDialog: WindowRef,
    public bottomSheet: MatBottomSheet
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
      if(res!='private_car'){
        this.motorInsurance.get('registration_number')?.setValue(null);
        this.motorInsurance.get('registration_number')?.clearValidators();
      }
    });
    this.sharedDataService.detailNotFound.subscribe((res) => {
      this.vehicleNotFound = res;
    });

    this.sharedDataService.registrationMonthSelection.subscribe((res) => {
      const start = new Date();
      const end = new Date(res.value);
      let monthGap = this.monthDiff(start, end);
      if (monthGap > 10) {
        this.insurerDisable = false;
        this.disableInsurer = this.insurerDisable;
        this.sharedDataService.insurerData(this.insurerDisable);
        this.motorInsurance.get('previous_insurer')?.setValidators([Validators.required]);
        this.motorInsurance.get('previous_insurer')?.updateValueAndValidity();
        this.motorInsurance.get('policy_expiry_date')?.setValidators([Validators.required]);
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
    let vehicleMMVData = sessionStorage.getItem('vehicleMMVData');
    if (vehicleMMVData) {
      sessionStorage.removeItem('vehicleMMVData');
    }

    let fetchQuotesData = sessionStorage.getItem('forQuotesFetchData');
    if (fetchQuotesData) {
      sessionStorage.removeItem('fetchQuotesData');
    }
    this.motorInsurance.controls['registration_number'].valueChanges.subscribe(
      (val: any) => {
        if (val && this.vehicleNotFound) {
          this.vehicleNotFound = '';
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
  /**
   * get vehicle detials submit event
   */

  getVehicleDetails() {
    localStorage.setItem(
      'withoutVehicleNumber',
      `${this.withoutVehicleNumber}`
    );

    if (!this.withoutVehicleNumber) {
      this.getVehicleDetailsInfo();
    } else {
      let vehicleMMVValue = JSON.stringify(this.motorInsurance?.value);
      sessionStorage.setItem('vehicleMMVData', vehicleMMVValue);
      this.sharedDataService.vehicleMMVDetails(this.motorInsurance, 'mmv');
      this.router.navigate(['/motor/quotes']);
    }
  }
  getVehicleNumber() {
    this.withoutVehicleNumber = !this.withoutVehicleNumber;
    if (this.withoutVehicleNumber) {
      this.motorInsurance.get('registration_number')?.setValidators([]);
      this.motorInsurance.get('registration_number')?.updateValueAndValidity();
      this.motorInsurance.get('vehicle')?.setValidators([Validators.required]);
      this.motorInsurance.get('vehicle')?.updateValueAndValidity();
      this.motorInsurance.get('rto_city')?.setValidators([Validators.required]);
      this.motorInsurance.get('rto_city')?.updateValueAndValidity();
      this.motorInsurance
        .get('registration_date')
        ?.setValidators([Validators.required]);
      this.motorInsurance.get('registration_date')?.updateValueAndValidity();
    } else {
      this.motorInsurance
        .get('registration_number')
        ?.setValidators([Validators.required]);
      this.motorInsurance.get('registration_number')?.updateValueAndValidity();
      this.motorInsurance.get('vehicle')?.setValidators([]);
      this.motorInsurance.get('vehicle')?.updateValueAndValidity();
      this.motorInsurance.get('rto_city')?.setValidators([]);
      this.motorInsurance.get('rto_city')?.updateValueAndValidity();
      this.motorInsurance.get('registration_date')?.setValidators([]);
      this.motorInsurance.get('registration_date')?.updateValueAndValidity();
    }
  }

  /**
   * Retrieves vehicle details information by making a request to the API with a specific registration number.
   * Uses the ApiService to fetch the requested response and subscribes to the observable.
   */

  getVehicleDetailsInfo() {
    this.vehicleTypeValue = localStorage.getItem('vehicleType');

    const regn_no = this.motorInsurance.controls['registration_number']?.value;

    if (regn_no) {
      sessionStorage.setItem('registrationNumber', `${regn_no}`);

      this.sharedDataService.vehicleDetails('registrationNumber');
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
      resWidth = '75%';
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
}
