import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationNumberComponent } from './components/form_fields/registration-number/registration-number.component';
import { VehicleTypeComponent } from './components/form_fields/vehicle-type/vehicle-type.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehicleComponent } from './components/form_fields/vehicle/vehicle.component';
import { RTOComponent } from './components/form_fields/rto/rto.component';
import { RegistrationYearComponent } from './components/form_fields/registration-year/registration-year.component';
import { PreviousInsurerComponent } from './components/form_fields/previous-insurer/previous-insurer.component';
import { PolicyExpiredDateComponent } from './components/form_fields/policy-expired-date/policy-expired-date.component';

import { SuccessDialogComponent } from './components/dialog-components/success-dialog/success-dialog.component';
import { FailureDialogComponent } from './components/dialog-components/failure-dialog/failure-dialog.component';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [
    RegistrationNumberComponent,
    VehicleTypeComponent,
    VehicleComponent,
    RTOComponent,
    RegistrationYearComponent,
    PreviousInsurerComponent,
    PolicyExpiredDateComponent,
    SuccessDialogComponent,
    FailureDialogComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    VehicleTypeComponent,
    RegistrationNumberComponent,
    VehicleComponent,
    RTOComponent,
    RegistrationYearComponent,
    PreviousInsurerComponent,
    PolicyExpiredDateComponent,
    SuccessDialogComponent,
    FailureDialogComponent,
    MaterialModule
  ],
})
export class SharedModule {}
