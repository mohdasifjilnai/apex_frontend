import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationNumberComponent } from './components/form_fields/registration-number/registration-number.component';
import { VehicleTypeComponent } from './components/form_fields/vehicle-type/vehicle-type.component';



@NgModule({
  declarations: [
    RegistrationNumberComponent,
    VehicleTypeComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    VehicleTypeComponent,
    RegistrationNumberComponent
  ]
})
export class SharedModule { }
