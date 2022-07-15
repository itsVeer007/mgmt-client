import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { ChartService } from './utilities/chart.service';
import { AddNewSiteComponent } from './main-dashboard/add-new-site/add-new-site.component';
import { AddNewCameraComponent } from './main-dashboard/add-new-camera/add-new-camera.component';
import { AddNewCustomerComponent } from './main-dashboard/add-new-customer/add-new-customer.component';
import { AddNewBusinessVerticalComponent } from './main-dashboard/add-new-business-vertical/add-new-business-vertical.component';
import { AddNewUserComponent } from './main-dashboard/add-new-user/add-new-user.component';
import { SitesComponent } from './sites/sites.component';
import { CustomersComponent } from './customers/customers.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './utilities/loader/loader.component';
import { SearchPipe } from './utilities/search.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MainDashboardComponent,
    AddNewSiteComponent,
    AddNewCameraComponent,
    AddNewCustomerComponent,
    AddNewBusinessVerticalComponent,
    AddNewUserComponent,
    SitesComponent,
    CustomersComponent,
    LoaderComponent,
    SearchPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    ChartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
