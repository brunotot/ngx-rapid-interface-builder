import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPainlessFormModule } from 'ngx-painless-form';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { LandingComponent } from './component/landing/landing.component';
import { CodeSnippetComponent } from './component/code-snippet/code-snippet.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LandingComponent,
    CodeSnippetComponent
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
