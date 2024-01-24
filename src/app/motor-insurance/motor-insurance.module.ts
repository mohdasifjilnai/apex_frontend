import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MotorInsuranceRoutingModule } from './motor-insurance-routing.module';
import { MotorInsuranceComponent } from './motor-insurance/motor-insurance.component';


@NgModule({
  declarations: [
    MotorInsuranceComponent
  ],
  imports: [
    CommonModule,
    MotorInsuranceRoutingModule
  ]
})
export class MotorInsuranceModule { }
