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
import { MatCardModule } from '@angular/material/card';
import { ProposalComponent } from './proposal/proposal.component';
import { CkycComponent } from './ckyc/ckyc.component';
import { VehicleOwnerDetailsComponent } from './vehicle-owner-details/vehicle-owner-details.component';
import { NomineeDetailsComponent } from './nominee-details/nominee-details.component';
import { ProposalVehicleDetailsComponent } from './proposal-vehicle-details/proposal-vehicle-details.component';
import { PreviousPolicyDetailsComponent } from './previous-policy-details/previous-policy-details.component';
import { InsuranceDetailsComponent } from './insurance-details/insurance-details.component';
import { VehicleInspectionComponent } from './vehicle-inspection/vehicle-inspection.component';
import { QuotesDropdownComponent } from './quotes-dropdown/quotes-dropdown.component';
import { ProposalReviewComponent } from './proposal-review/proposal-review.component';
import { PaymentComponent } from './payment/payment.component';



@NgModule({
  declarations: [
    MotorInsuranceComponent,
    QuotesComponent,
    VehicleDetailsCardComponent,
    VehicleDetailsPopupComponent,
    ChooseIDVComponent,
    AddOnsComponent,
    QuotesListingComponent,
    PremiumBreakupCardComponent,
    ProposalComponent,
    CkycComponent,
    VehicleOwnerDetailsComponent,
    NomineeDetailsComponent,
    ProposalVehicleDetailsComponent,
    PreviousPolicyDetailsComponent,
    InsuranceDetailsComponent,
    VehicleInspectionComponent,
    QuotesDropdownComponent,
    ProposalReviewComponent,
    PaymentComponent,
  ],
  imports: [
    CommonModule,
    MotorInsuranceRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class MotorInsuranceModule {}
