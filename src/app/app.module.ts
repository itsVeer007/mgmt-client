import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//components
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
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { AddAdditionalSiteComponent } from './main-dashboard/add-additional-site/add-additional-site.component';
import { AssetsComponent } from './assets/assets.component';
import { TicketsComponent } from './tickets/tickets.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AddDeviceComponent } from './main-dashboard/add-device/add-device.component';
import { AddNewAssetComponent } from './main-dashboard/add-new-asset/add-new-asset.component';
import { VerticalsComponent } from './verticals/verticals.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { AddNewInventoryComponent } from './main-dashboard/add-new-inventory/add-new-inventory.component';
import { AddNewAnalyticComponent } from './main-dashboard/add-new-analytic/add-new-analytic.component';
import { AddNewTicketComponent } from './main-dashboard/add-new-ticket/add-new-ticket.component';

// material module
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
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

//utilities
import { MultiSelectSearchComponent } from './utilities/multi-select-search/multi-select-search.component';
import { VjsPlayerComponent } from './utilities/vjs-player/vjs-player.component';
import { LoaderComponent } from './utilities/loader/loader.component';
import { ChartService } from 'src/services/chart.service';
import { SearchPipe } from './utilities/search.pipe';
import { DatePipe } from '@angular/common';
import { AdInfoComponent } from './assets/ad-info/ad-info.component';
import { ReportsComponent } from './reports/reports.component';
import { MetaDataComponent } from './meta-data/meta-data.component';
import { AddMetadataComponent } from './main-dashboard/add-metadata/add-metadata.component';

import { SortPipe } from './utilities/sort.pipe';
import { DeviceViewComponent } from './main-dashboard/add-device/device-view/device-view.component';
import { DevicesComponent } from './devices/devices.component';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ProductMasterComponent } from './product-master/product-master.component';
import { AddProductMasterComponent } from './main-dashboard/add-product-master/add-product-master.component';
import { QRAdsComponent } from './reports/qr-ads/qr-ads.component';
import { WifiAdsComponent } from './reports/wifi-ads/wifi-ads.component';
import { VendorsComponent } from './vendors/vendors.component';
import { AddNewVendorComponent } from './main-dashboard/add-new-vendor/add-new-vendor.component';
import { AddNewDeviceComponent } from './main-dashboard/add-new-device/add-new-device.component';
import { OrdersComponent } from './orders/orders.component';
import { AddNewOrderComponent } from './main-dashboard/add-new-order/add-new-order.component';
import { IndentsComponent } from './indents/indents.component';
import { AddNewIndentComponent } from './main-dashboard/add-new-indent/add-new-indent.component';
import { FrComponent } from './fr/fr.component';
import { TicketReportsComponent } from './ticket-reports/ticket-reports.component';
import { AdvertisementsComponent } from './advertisements/advertisements.component';
import { FrKitComponent } from './fr-kit/fr-kit.component';
import { AddNewFrkitComponent } from './main-dashboard/add-new-frkit/add-new-frkit.component';
import { FrReportsComponent } from './fr-reports/fr-reports.component';

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
    AddNewAnalyticComponent,
    AddNewTicketComponent,
    AdInfoComponent,
    ReportsComponent,
    MetaDataComponent,
    AddMetadataComponent,
    SortPipe,
    DeviceViewComponent,
    DevicesComponent,
    ProductMasterComponent,
    AddProductMasterComponent,
    QRAdsComponent,
    WifiAdsComponent,
    VendorsComponent,
    AddNewVendorComponent,
    AddNewDeviceComponent,
    OrdersComponent,
    AddNewOrderComponent,
    IndentsComponent,
    AddNewIndentComponent,
    FrComponent,
    TicketReportsComponent,
    AdvertisementsComponent,
    FrKitComponent,
    AddNewFrkitComponent,
    FrReportsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,

    //Mat Module
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
    MatProgressBarModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatMenuModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  providers: [
    ChartService,
    SearchPipe,
    DatePipe,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
