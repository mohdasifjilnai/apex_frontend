import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      // {
      //   path: '',
      //   loadChildren: () =>
      //     import('../home-page/home-page.module').then((m) => m.HomePageModule),
      //     canActivate: [AuthGuard],
      // },
      // {
      //   path: 'ic-onboarding',
      //   loadChildren: () =>
      //     import('../ic-onboarding/ic-onboarding.module').then(
      //       (m) => m.IcOnboardingModule
      //     ),
      //     canActivate: [AuthGuard],
      // },
      // {
      //   path: 'rb-home',
      //   loadChildren: () =>
      //     import('../rb-home/rb-home.module').then(
      //       (m) => m.RbHomeModule
      //     ),
      //     canActivate: [AuthGuard],
      // },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UiRoutingModule { }
