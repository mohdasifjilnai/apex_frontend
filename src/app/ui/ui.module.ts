import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiRoutingModule } from './ui-routing.module';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout/layout.component';

import { MatRadioModule } from '@angular/material/radio';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FooterComponent } from './footer/footer.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    HeaderComponent,
    LayoutComponent,
    BreadcrumbComponent,
    FooterComponent,
  ],
  imports: [CommonModule, UiRoutingModule, MatRadioModule, MatTooltipModule,MatProgressSpinnerModule],
})
export class UiModule {}
