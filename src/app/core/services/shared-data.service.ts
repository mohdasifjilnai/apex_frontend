import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';
import { ApiConstants } from 'src/app/api.constant';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  getVehicleDetails: Subject<any> = new Subject();
  getSelectedvehicle: Subject<any> = new Subject();
  getSelectedVehicleType: Subject<any> = new Subject();
  getRegistrationValue: Subject<any> = new Subject();
  regNumberData: Subject<any> = new Subject();
  regNumber: any;
  constructor(private apiService: ApiService, private router: Router) {}

  sendVehicleEditData(data: any) {
    this.getVehicleDetails.next(data);
  }
  /**
   *
   * @param data send vehicle type data for the vehicle search
   */
  selectedvehicle(data: any) {
    this.getSelectedvehicle.next(data);
  }

  /**
   *
   * @param data send vehicle type data for the vehicle search
   */
  selectedVehicleType(data: any) {
    this.getSelectedVehicleType.next(data);
  }

  /**
   *  this method use set data in local storage
   */
  setDataLocalStorage(type: string = '', key: string = '', value: string = '') {
    let getItemValue;
    switch (type) {
      case 'setItem':
        localStorage.setItem(key, value);
        break;
      case 'getItem':
        getItemValue = localStorage.getItem(key);
        break;
      case 'removeItem':
        localStorage.removeItem(key);
        break;
      default:
        localStorage.clear();
    }
    return getItemValue;
  }

  /**
   *  this method use set data in local storage
   */
  setDataSessionStorage(
    type: string = '',
    key: string = '',
    value: string = ''
  ) {
    let getItemValue;
    switch (type) {
      case 'setItem':
        sessionStorage.setItem(key, value);
        break;
      case 'getItem':
        getItemValue = sessionStorage.getItem(key);
        break;
      case 'removeItem':
        sessionStorage.removeItem(key);
        break;
      default:
        sessionStorage.clear();
    }
    return getItemValue;
  }

  vehicleDetails() {
    this.regNumber = sessionStorage.getItem('registrationNumber');
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.registration_number}?regn_no=${this.regNumber}`
      )
      .subscribe((res: any) => {
        if (res) {
          this.regNumberData.next(res);
          this.router.navigate(['/motor/quotes']);
        }
      });
  }
}
