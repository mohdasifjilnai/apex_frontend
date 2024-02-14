import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import city from './city-name.json';
import multi_select_city from './multi-select.json';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiConstants } from 'src/app/api.constant';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';

const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-motor-insurance',

  templateUrl: './motor-insurance.component.html',
  styleUrls: ['./motor-insurance.component.scss'],
})
export class MotorInsuranceComponent implements OnInit {
  cities: any = city;
  multi_select_cities: any = multi_select_city;
  withoutVehicleNumber: boolean = false;
  vehcileType = 'private_car';
  vehicleTypeValue: any;

  motorInsurance: FormGroup = new FormGroup({
    registration_number: new FormControl('', [Validators.required]),
    vehicle: new FormControl(''),
    rto_city: new FormControl(''),
    registration_year: new FormControl(moment()),
    previous_insurer: new FormControl(''),
    policy_expiry_date: new FormControl(''),
  });
  // Validators.pattern(new RegExp('/^[ A-Za-z0-9-]*$/'))

  // Validators.pattern(
  //   new RegExp('^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$')
  // ),
  constructor(
    private router: Router,
    private apiService: ApiService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    this.sharedDataService.getSelectedvehicle.subscribe((res) => {
      this.vehcileType = res;
    });
  }

  /**
   * get vehicle detials submit event
   */

  getVehicleDetails() {
    localStorage.setItem('withoutVehicleNumber',
    `${this.withoutVehicleNumber}`)
  
    if (!this.withoutVehicleNumber) {
      this.getVehicleDetailsInfo('');
    } else {
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
        .get('registration_year')
        ?.setValidators([Validators.required]);
      this.motorInsurance.get('registration_year')?.updateValueAndValidity();
    } else {
      this.motorInsurance
        .get('registration_number')
        ?.setValidators([Validators.required]);
      this.motorInsurance.get('registration_number')?.updateValueAndValidity();
      this.motorInsurance.get('vehicle')?.setValidators([]);
      this.motorInsurance.get('vehicle')?.updateValueAndValidity();
      this.motorInsurance.get('rto_city')?.setValidators([]);
      this.motorInsurance.get('rto_city')?.updateValueAndValidity();
      this.motorInsurance.get('registration_year')?.setValidators([]);
      this.motorInsurance.get('registration_year')?.updateValueAndValidity();
    }
  }

  /**
   * Retrieves vehicle details information by making a request to the API with a specific registration number.
   * Uses the ApiService to fetch the requested response and subscribes to the observable.
   */

  getVehicleDetailsInfo(vehicleType: any) {
    this.vehicleTypeValue = localStorage.getItem('vehicleType');
    
    const regn_no = this.motorInsurance.controls['registration_number']?.value;

    if (regn_no) {
      sessionStorage.setItem('registrationNumber',
      `${regn_no}`)
   
      this.sharedDataService.vehicleDetails();
    }
  }
}
