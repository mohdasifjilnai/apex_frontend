import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationNumberComponent } from './components/form_fields/registration-number/registration-number.component';
import { VehicleTypeComponent } from './components/form_fields/vehicle-type/vehicle-type.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    RegistrationNumberComponent,
    VehicleTypeComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    VehicleTypeComponent,
    RegistrationNumberComponent,
    
    
  ]
})
export class SharedModule { }
