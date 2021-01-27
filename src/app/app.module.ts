import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AccessDeniedComponent} from './main/components/access-denied/access-denied.component';
import {SharedModule} from './shared/shared.module';

import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtInterceptorService} from './main/services/jwt-interceptor.service';
import { HeaderComponent } from './main/components/header/header.component';
import { SideNavListComponent } from './main/components/side-nav-list/side-nav-list.component';
import { HomeComponent } from './main/components/home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    AccessDeniedComponent,
    HeaderComponent,
    SideNavListComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true
    }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
