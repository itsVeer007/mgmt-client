import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { ChartService } from './chart.service';
import { AddNewSiteComponent } from './add-new-site/add-new-site.component';
import { AddNewCameraComponent } from './add-new-camera/add-new-camera.component';
import { AddNewCustomerComponent } from './add-new-customer/add-new-customer.component';
import { AddNewBusinessVerticalComponent } from './add-new-business-vertical/add-new-business-vertical.component';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MainDashboardComponent,
    AddNewSiteComponent,
    AddNewCameraComponent,
    AddNewCustomerComponent,
    AddNewBusinessVerticalComponent,
    AddNewUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    ChartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
