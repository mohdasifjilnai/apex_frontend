import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { FormsModule } from '@angular/forms';
import { WindowRef } from './core/services/window-ref.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    FormsModule
  ],
  providers: [
    WindowRef,
],
  bootstrap: [AppComponent],

})
export class AppModule { }
