import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for fetching JSON
import vehicleTypeList from '../../json/vehicle-types.json';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.scss'],
})
export class VehicleTypeComponent implements OnInit {
  vehicleTypeListData = vehicleTypeList;
  selectedVehicleType: any;
  env=environment
  constructor(private http: HttpClient, private sharedata: SharedDataService,private route: ActivatedRoute) {}

  ngOnInit(): void {
    sessionStorage.setItem('vehicleType', `private_car`);
    this.selectedVehicleType = this.vehicleTypeListData.vehicleTypeList.find(
      (vehicle) => vehicle.optionName === 'Private Car'
    );
    this.route.queryParamMap.subscribe(params => {
      const vehicleTypeFromUrl=params.get('vehicle')
      if(vehicleTypeFromUrl=='twoWheeler'){
        sessionStorage.setItem('vehicleType', `two_wheeler`);
        this.selectedVehicleType = this.vehicleTypeListData.vehicleTypeList.find(
          (vehicle) => vehicle.optionName === 'Two Wheeler'
        );
      }
    })
  }

  selectVehicle(vehicle: any,index: number) {
    if(this.env.apex!='https://dev-apex.rbstaging.in/' || this.env.apex_local!='http://test.rbstaging.in/' ){
      if(index!=2){
        this.selectedVehicleType = vehicle;

    sessionStorage.setItem(
      'vehicleType',
      `${this.selectedVehicleType.optionNameValue}`
    );
    this.sharedata.selectedvehicle(this.selectedVehicleType.optionNameValue);
      }
    }else{
      this.selectedVehicleType = vehicle;

      sessionStorage.setItem(
        'vehicleType',
        `${this.selectedVehicleType.optionNameValue}`
      );
      this.sharedata.selectedvehicle(this.selectedVehicleType.optionNameValue);
    }    
  }
  isLast(index: number): boolean {
    return index === this.vehicleTypeListData.vehicleTypeList.length - 1;
  }
}
