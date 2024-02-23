import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WindowRef } from './core/services/window-ref.service';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GlobalLoaderInterceptor } from './core/interceptor/global-loader.interceptor';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BrowserAnimationsModule,
  ],
  providers: [WindowRef,DatePipe, 
    // {
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: GlobalLoaderInterceptor,
  //   multi: true
  // }
],

  bootstrap: [AppComponent],
})
export class AppModule {}
