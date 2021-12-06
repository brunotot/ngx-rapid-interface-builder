import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPainlessFormModule } from 'ngx-painless-form';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxPainlessFormModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
