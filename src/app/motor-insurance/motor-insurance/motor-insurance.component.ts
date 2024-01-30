import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from 'src/app/ui/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-motor-insurance',
 
  templateUrl: './motor-insurance.component.html',
  styleUrls: ['./motor-insurance.component.scss']
})
export class MotorInsuranceComponent implements OnInit {
  withoutVehicleNumber:boolean = false

  motorInsurance: FormGroup = new FormGroup({
    registration_number: new FormControl('', Validators.required),
    vehicle:new FormControl('',Validators.required)
  
  });
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

//  get vehicle detials submit event
  getVehicleDetails(){
    this.router.navigate(['/motor/quotes'])
  }

  getVehicleNumber(){
    this.withoutVehicleNumber = !this.withoutVehicleNumber
  }
}
