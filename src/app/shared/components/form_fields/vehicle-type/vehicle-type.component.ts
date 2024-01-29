import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for fetching JSON
import vehicleTypeList from '../vehicle-type/vehicle-types.json'


@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.scss']
})
export class VehicleTypeComponent implements OnInit {
  vehicleTypeListData = vehicleTypeList;
 
  

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
   
  }
}
