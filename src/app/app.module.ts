import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
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
import { XpAnimationDirective } from './utilities/animation/animation.directive';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { AddAdditionalSiteComponent } from './main-dashboard/sub-forms/add-additional-site/add-additional-site.component';
import { MultiSelectSearchComponent } from './utilities/multi-select-search/multi-select-search.component';
import { AssetsComponent } from './assets/assets.component';
import { TicketsComponent } from './tickets/tickets.component';
import { InventoryComponent } from './inventory/inventory.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';


import { AddDeviceComponent } from './main-dashboard/sub-forms/add-device/add-device.component';
import { AddNewAssetComponent } from './main-dashboard/add-new-asset/add-new-asset.component';
import { VjsPlayerComponent } from './utilities/vjs-player/vjs-player.component';
import { VerticalsComponent } from './verticals/verticals.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { AddNewInventoryComponent } from './main-dashboard/add-new-inventory/add-new-inventory.component';
import { ChartService } from 'src/services/chart.service';
import { DropdownSearchComponent } from './utilities/dropdown-search/dropdown-search.component';
import { AddNewAnalyticComponent } from './main-dashboard/add-new-analytic/add-new-analytic.component';
import { AddNewTicketComponent } from './main-dashboard/add-new-ticket/add-new-ticket.component';

import { DatePipe } from '@angular/common';

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
    SearchPipe,
    LoginComponent,
    UsersComponent,
    AddAdditionalSiteComponent,
    MultiSelectSearchComponent,
    AssetsComponent,
    TicketsComponent,
    InventoryComponent,
    AddDeviceComponent,
    AddNewAssetComponent,
    VjsPlayerComponent,
    VerticalsComponent,
    AnalyticsComponent,
    AddNewInventoryComponent,
    DropdownSearchComponent,
    AddNewAnalyticComponent,
    AddNewTicketComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatDividerModule,
    MatListModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTabsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressBarModule
  ],
  providers: [
    ChartService,
    SearchPipe,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
