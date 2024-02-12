import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import city from './city-name.json';
import multi_select_city from './multi-select.json';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiConstants } from 'src/app/api.constant';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
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
    registration_number: new FormControl('', Validators.required),
    vehicle: new FormControl('', Validators.required),
    rto_city: new FormControl('', Validators.required),
    registration_year: new FormControl('', Validators.required),
    previous_insurer: new FormControl(''),
    policy_expiry_date: new FormControl(''),
  });

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
    this.sharedDataService.setDataLocalStorage(
      'setItem',
      'withoutVehicleNumber',
      `${this.withoutVehicleNumber}`
    );
    if (!this.withoutVehicleNumber) {
      this.getVehicleDetailsInfo('');
    } else {
      this.router.navigate(['/motor/quotes']);
    }
  }
  getVehicleNumber() {
    this.withoutVehicleNumber = !this.withoutVehicleNumber;
  }

  /**
   * Retrieves vehicle details information by making a request to the API with a specific registration number.
   * Uses the ApiService to fetch the requested response and subscribes to the observable.
   */

  getVehicleDetailsInfo(vehicleType: any) {
    this.vehicleTypeValue = this.sharedDataService.setDataLocalStorage(
      'getItem',
      'vehicleType'
    );
    const regn_no = this.motorInsurance.controls['registration_number']?.value;

    if (regn_no) {
      this.sharedDataService.setDataSessionStorage(
        'setItem',
        'registrationNumber',
        `${regn_no}`
      );
      this.sharedDataService.vehicleDetails();
    }
  }
}
