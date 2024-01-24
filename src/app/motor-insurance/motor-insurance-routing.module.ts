import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotorInsuranceComponent } from './motor-insurance/motor-insurance.component';

const routes: Routes = [
  {
    path: '',
    component: MotorInsuranceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MotorInsuranceRoutingModule { }
