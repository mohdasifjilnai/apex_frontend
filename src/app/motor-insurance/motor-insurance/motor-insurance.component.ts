import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BreadcrumbComponent } from 'src/app/ui/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-motor-insurance',
 
  templateUrl: './motor-insurance.component.html',
  styleUrls: ['./motor-insurance.component.scss']
})
export class MotorInsuranceComponent implements OnInit {


  motorInsurance: FormGroup = new FormGroup({
    registration_number: new FormControl('', Validators.required),
  
  });
  constructor() { }

  ngOnInit(): void {
  }

}
