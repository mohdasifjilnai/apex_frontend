import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for fetching JSON

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.scss']
})
export class VehicleTypeComponent implements OnInit {
  vehicleTypeList!: any[];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // this.http.get<any[]>('src/app/shared/components/form_fields/vehicle-type/vehicle-types.json').subscribe(data => {
    //   this.vehicleTypeList = data;
    // });
  }
}
