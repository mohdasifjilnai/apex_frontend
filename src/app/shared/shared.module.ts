import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationNumberComponent } from './components/form_fields/registration-number/registration-number.component';
import { VehicleTypeComponent } from './components/form_fields/vehicle-type/vehicle-type.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    RegistrationNumberComponent,
    VehicleTypeComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports:[
    VehicleTypeComponent,
    RegistrationNumberComponent
  ]
})
export class SharedModule { }
