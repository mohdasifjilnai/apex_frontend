import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-proposal-vehicle-details',
  templateUrl: './proposal-vehicle-details.component.html',
  styleUrls: ['./proposal-vehicle-details.component.scss']
})
export class ProposalVehicleDetailsComponent implements OnInit {
  filteredPincodeList!: Observable<any[]>;

  proposalVehilceDetailsForm:FormGroup = new FormGroup({
    registration_number: new FormControl('',Validators.required),
    vehicle_colour: new FormControl('',Validators.required),
    engine_number: new FormControl('',Validators.required),
    chassis_number: new FormControl('',Validators.required),
    registration_date: new FormControl('',Validators.required),
    manufacture_date: new FormControl('',Validators.required),
    vehicle_pincode: new FormControl('',Validators.required),
    vehilce_city:new FormControl('',Validators.required),
    vehicle_state: new FormControl('',Validators.required),
    previous_insurer: new FormControl('',Validators.required)
  })

  constructor() { }

  ngOnInit(): void {
  }

}
