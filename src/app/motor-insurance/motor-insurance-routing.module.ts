import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotorInsuranceComponent } from './motor-insurance/motor-insurance.component';
import { QuotesComponent } from './quotes/quotes.component';
import { ProposalComponent } from './proposal/proposal.component';
import { VehicleInspectionComponent } from './vehicle-inspection/vehicle-inspection.component';
import { ProposalReviewComponent } from './proposal-review/proposal-review.component';
import { PaymentComponent } from './payment/payment.component';
const routes: Routes = [
  {
    path: '',
    component: MotorInsuranceComponent,
    data: {
      breadcrumb: [{ name: 'Motor Insurance', path: ['motor'] }],
    },
  },
  {
    path: 'quotes',
    component: QuotesComponent,
    data: {
      breadcrumb: [
        { name: 'Motor Insurance', path: ['motor'] },
        { name: 'Quotes Listing', path: [''] },
      ],
    },
  },
  {
    path: 'quotes/proposal/:transactionId',
    component: ProposalComponent,
    data: {
      breadcrumb: [
        { name: 'Motor Insurance', path: ['motor'] },
        { name: 'Quotes Listing', path: ['motor/quotes'] },
        { name: 'Proposal Form', path: [''] },
      ],
    },
  },
  {
    path: 'quotes/inspection',
    component: VehicleInspectionComponent,
    data: {
      breadcrumb: [
        { name: 'Motor Insurance', path: ['motor'] },
        { name: 'Quotes Listing', path: ['motor/quotes'] },
        { name: 'Proposal Form', path: ['motor/quotes/proposal'] },
        { name: 'Vehicle Inspection', path: [''] },
      ],
    },
  },
  {
    path: 'quotes/proposal/:transactionId/review',
    component: ProposalReviewComponent,
    data: {
      breadcrumb: [
        { name: 'Motor Insurance', path: ['motor'] },
        { name: 'Quotes Listing', path: ['motor/quotes'] },
        { name: 'Proposal Form', path: ['motor/quotes/proposal'] },
        { name: 'Proposal Review', path: ['motor/quotes/proposal/review'] },
      ],
    },
  },
  {
    path: 'quotes/proposal/:transactionId/review/payment-success',
    component: PaymentComponent,
    data: {
      breadcrumb: [{ name: 'Motor Insurance', path: ['motor'] }, ,],
    },
  },
  {
    path: 'quotes/proposal/:transactionId/review/payment-failure',
    component: PaymentComponent,
    data: {
      breadcrumb: [{ name: 'Motor Insurance', path: ['motor'] }],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MotorInsuranceRoutingModule {}
