import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiRoutingModule } from './ui-routing.module';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import {MatRadioModule} from '@angular/material/radio';


@NgModule({
  declarations: [
    HeaderComponent,
    LayoutComponent,
    // BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    UiRoutingModule,
    MatRadioModule
  ],
  // exports: [
  //   BreadcrumbComponent,
   
  // ],
})
export class UiModule { }
