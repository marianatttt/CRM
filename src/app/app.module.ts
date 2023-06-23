import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {FormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {MatDialogModule} from "@angular/material/dialog";

import {AuthLayoutComponent} from "./layouts/auth-layout/auth-layout.component";
import { HeaderLayoutComponent } from './layouts/header-layout/header-layout.component';
import {MainLayoutComponent} from "./layouts/main-layout/main-layout.component";
import {AppRoutingModule} from "./app-routing.module";
import { AppComponent } from './app.component';
import {MainInterceptor} from "./main.interceptor";
import {MatButtonModule} from "@angular/material/button";
import {AuthGuard} from "./guards/auth.guard";






@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    HeaderLayoutComponent,
    MainLayoutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    FormsModule,
    NgxPaginationModule,
    MatDialogModule,
    MatButtonModule,
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: MainInterceptor
    },
    AuthGuard

  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
