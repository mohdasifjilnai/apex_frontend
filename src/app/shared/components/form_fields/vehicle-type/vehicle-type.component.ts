import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.scss']
})
export class VehicleTypeComponent implements OnInit {
  vehicleTypeList:any;

  constructor() { }

  ngOnInit(): void {
    this.vehicleTypeList = [
      {
        optionName: 'Two Wheeler',
        imageUrl: '/assets/icon/two-wheeler.svg',
        imageInformation: 'Two Wheeler',
      },
      {
        optionName: 'Private Car',
        imageUrl: '/assets/icon/private-car.svg',
        imageInformation: 'Private Car',
      },
      {
        optionName: 'Commercial Vehicle',
        imageUrl: '/assets/icon/commercial-vehicle.svg',
        imageInformation: 'Commercial Vehicle',
      },
    ];
  }

}
