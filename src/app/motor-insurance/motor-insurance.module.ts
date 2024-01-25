import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MotorInsuranceRoutingModule } from './motor-insurance-routing.module';
import { MotorInsuranceComponent } from './motor-insurance/motor-insurance.component';
import { BreadcrumbComponent } from '../ui/breadcrumb/breadcrumb.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    MotorInsuranceComponent,
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    MotorInsuranceRoutingModule,
    SharedModule
  ]
})
export class MotorInsuranceModule { }
