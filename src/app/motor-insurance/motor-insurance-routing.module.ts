import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotorInsuranceComponent } from './motor-insurance/motor-insurance.component';
import { QuotesComponent } from './quotes/quotes.component';
import { ProposalComponent } from './proposal/proposal.component';
import { VehicleInspectionComponent } from './vehicle-inspection/vehicle-inspection.component';
import { ProposalReviewComponent } from './proposal-review/proposal-review.component';
import { PaymentComponent } from './payment/payment.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { InstantQuotationComponent } from './instant-quotation/instant-quotation.component';
const routes: Routes = [
  {
    path: '',
    component: MotorInsuranceComponent,
    data: {
      breadcrumb: [{ name: 'Motor Insurance', path: [''] }],
    },
  },
  {
    path: 'quotes/:traceId',
    component: QuotesComponent,
    data: {
      breadcrumb: [
        { name: 'Motor Insurance', path: [''] },
        { name: 'Quotes Listing', path: ['quotes'] },
      ],
    },
    canActivate: [AuthGuard],
  },

  {
    path: 'quotes/proposal/:transactionId',
    component: ProposalComponent,
    data: {
      breadcrumb: [
        { name: 'Motor Insurance', path: [''] },
        { name: 'Quotes Listing', path: ['quotes'] },
        {
          name: 'Proposal Form',
        },
      ],
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'quotes/proposal/:transactionId/review/inspection',
    component: VehicleInspectionComponent,
    data: {
      breadcrumb: [{ name: 'Motor Insurance', path: [''] }],
    },
  },
  {
    path: 'quotes/proposal/:transactionId/review',
    component: ProposalReviewComponent,
    data: {
      // breadcrumb: [
      //   { name: 'Motor Insurance', path: ['motor'] },
      //   { name: 'Quotes Listing', path: ['quotes'] },
      //   { name: 'Proposal Form', path: ['quotes/proposal'] },
      // ],
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'quotes/proposal/:transactionId/review/payment-success',
    component: PaymentComponent,
    // data: {
    //   breadcrumb: [{ name: 'Motor Insurance', path: ['motor'] }, ,],
    // },
  },
  {
    path: 'quotes/proposal/:transactionId/review/payment-failure',
    component: PaymentComponent,
    // data: {
    //   breadcrumb: [{ name: 'Motor Insurance', path: ['motor'] }],
    // },
  },
  {
    path: 'instantQuotation',
    component: InstantQuotationComponent,
    data: {
      breadcrumb: [{ name: '', path: ['instantQuotation'] }],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MotorInsuranceRoutingModule {}
