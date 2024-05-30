import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for fetching JSON
import vehicleTypeList from '../../json/vehicle-types.json';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.scss'],
})
export class VehicleTypeComponent implements OnInit {
  vehicleTypeListData = vehicleTypeList;
  selectedVehicleType: any;

  constructor(private http: HttpClient, private sharedata: SharedDataService) {}

  ngOnInit(): void {
    sessionStorage.setItem('vehicleType', `private_car`);
    // Initialize selectedVehicleType to "Private Car" by default
    this.selectedVehicleType = this.vehicleTypeListData.vehicleTypeList.find(
      (vehicle) => vehicle.optionName === 'Private Car'
    );
  }

  selectVehicle(vehicle: any) {
    this.selectedVehicleType = vehicle;

    sessionStorage.setItem(
      'vehicleType',
      `${this.selectedVehicleType.optionNameValue}`
    );
    this.sharedata.selectedvehicle(this.selectedVehicleType.optionNameValue);
  }
  isLast(index: number): boolean {
    return index === this.vehicleTypeListData.vehicleTypeList.length - 1;
  }
}
