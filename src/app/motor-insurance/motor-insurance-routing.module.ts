import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotorInsuranceComponent } from './motor-insurance/motor-insurance.component';
import { QuotesComponent } from './quotes/quotes.component';


const routes: Routes = [
  {
    path: '',
    component: MotorInsuranceComponent,
    data: {
      breadcrumb: [
        { name: 'Main', path: ['motor'] },
       
      ],
    },
    
  },
  {
    path: 'quotes',
    component: QuotesComponent,
    data: {
      breadcrumb: [
        { name: 'Main', path: ['quotes'] },
       
      ],
    },
    
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MotorInsuranceRoutingModule { }
