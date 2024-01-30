import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MotorInsuranceRoutingModule } from './motor-insurance-routing.module';
import { MotorInsuranceComponent } from './motor-insurance/motor-insurance.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuotesComponent } from './quotes/quotes.component';
import { VehicleDetailsCardComponent } from './vehicle-details-card/vehicle-details-card.component';
import { VehicleDetailsPopupComponent } from './vehicle-details-popup/vehicle-details-popup.component';
import { ChooseIDVComponent } from './choose-idv/choose-idv.component';
import { AddOnsComponent } from './add-ons/add-ons.component';
import { QuotesListingComponent } from './quotes-listing/quotes-listing.component';
import { PremiumBreakupCardComponent } from './premium-breakup-card/premium-breakup-card.component';



@NgModule({
  declarations: [
    MotorInsuranceComponent,
    QuotesComponent,
    VehicleDetailsCardComponent,
    VehicleDetailsPopupComponent,
    ChooseIDVComponent,
    AddOnsComponent,
    QuotesListingComponent,
    PremiumBreakupCardComponent
  ],
  imports: [
    CommonModule,
    MotorInsuranceRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MotorInsuranceModule { }
