import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for fetching JSON
import vehicleTypeList from '../../json/vehicle-types.json';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
declare const webengage: any;
@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.scss'],
})
export class VehicleTypeComponent implements OnInit {
  vehicleTypeListData = vehicleTypeList;
  selectedVehicleType: any;
  env = environment;
  constructor(
    private http: HttpClient,
    private sharedata: SharedDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    sessionStorage.setItem('vehicleType', `private_car`);
    this.selectedVehicleType = this.vehicleTypeListData.vehicleTypeList.find(
      (vehicle) => vehicle.optionName === 'Private Car'
    );
    this.route.queryParamMap.subscribe((params) => {
      const vehicleTypeFromUrl = params.get('vehicle');
      if (vehicleTypeFromUrl == 'twoWheeler') {
        sessionStorage.setItem('vehicleType', `two_wheeler`);
        this.selectedVehicleType =
          this.vehicleTypeListData.vehicleTypeList.find(
            (vehicle) => vehicle.optionName === 'Two Wheeler'
          );
      }
    });
    let vehicleTypeValue = sessionStorage.getItem('vehicleType');
    webengage.track('Motor_selected', {
      Vehicle_Type: vehicleTypeValue,
      User_Type: sessionStorage.getItem('partner_code')
        ? 'Partner'
        : 'Customer',
      Motor_Type: vehicleTypeValue,
    });
  }

  selectVehicle(vehicle: any) {
    this.selectedVehicleType = vehicle;
    sessionStorage.setItem(
      'vehicleType',
      `${this.selectedVehicleType.optionNameValue}`
    );
    let vehicleTypeValue = sessionStorage.getItem('vehicleType');
    webengage.track('Motor_selected', {
      Vehicle_Type: vehicleTypeValue,
      User_Type: sessionStorage.getItem('partner_code')
        ? 'Partner'
        : 'Customer',
      Motor_Type: vehicleTypeValue,
    });
    this.sharedata.selectedvehicle(this.selectedVehicleType.optionNameValue);
    if (vehicle?.optionNameValue == 'commercial_vehicle') {
      // const api='https://apex.renewbuyinsurance.in/cv/api/v1/auth/agent_redirection/'
      window.location.href = `${this.env?.baseUrl}cv/`;
    }
  }
  isLast(index: number): any {
    return index === this.vehicleTypeListData.vehicleTypeList.length - 1;
  }
}
