import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { AddNewSiteComponent } from './main-dashboard/add-new-site/add-new-site.component'
import { AddNewCameraComponent } from './main-dashboard/add-new-camera/add-new-camera.component';
import { AddNewCustomerComponent } from './main-dashboard/add-new-customer/add-new-customer.component';
import { AddNewUserComponent } from './main-dashboard/add-new-user/add-new-user.component';
import { AddNewBusinessVerticalComponent } from './main-dashboard/add-new-business-vertical/add-new-business-vertical.component';
import { SitesComponent } from './sites/sites.component';
import { CustomersComponent } from './customers/customers.component';
import { LoginComponent } from './login/login.component'
import { UsersComponent } from './users/users.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AssetsComponent } from './assets/assets.component';
import { TicketsComponent } from './tickets/tickets.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { VerticalsComponent } from './verticals/verticals.component';
import { ReportsComponent } from './reports/reports.component';
import { MetaDataComponent } from './meta-data/meta-data.component';
import { DevicesComponent } from './devices/devices.component';
import { ProductMasterComponent } from './product-master/product-master.component';
import { WifiAdsComponent } from './reports/wifi-ads/wifi-ads.component';
import { QRAdsComponent } from './reports/qr-ads/qr-ads.component';
import { VendorsComponent } from './vendors/vendors.component';
import { OrdersComponent } from './orders/orders.component';
import { IndentsComponent } from './indents/indents.component';
import { FrComponent } from './fr/fr.component';
import { TicketReportsComponent } from './ticket-reports/ticket-reports.component';
import { AdvertisementsComponent } from './advertisements/advertisements.component';
import { FrKitComponent } from './fr-kit/fr-kit.component';
import { FrReportsComponent } from './fr-reports/fr-reports.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'main-dashboard', component: MainDashboardComponent },
  { path: 'verticals', component: VerticalsComponent },
  { path: 'add-new-site', component: AddNewSiteComponent },
  { path: 'add-new-camera', component: AddNewCameraComponent },
  { path: 'add-new-customer', component: AddNewCustomerComponent },
  { path: 'add-new-user', component: AddNewUserComponent },
  { path: 'add-new-business', component: AddNewBusinessVerticalComponent },
  { path: 'sites', component: SitesComponent },
  { path: 'devices', component: DevicesComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'users', component: UsersComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'product-master', component: ProductMasterComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'indents', component: IndentsComponent },
  { path: 'tickets', component: TicketsComponent },
  { path: 'ticket-reports', component: TicketReportsComponent },
  { path: 'fr', component: FrComponent },
  { path: 'assets', component: AssetsComponent },
  { path: 'advertisements', component: AdvertisementsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'meta', component: MetaDataComponent },
  { path: 'vendors', component: VendorsComponent },
  { path: 'fr-reports', component: FrReportsComponent },
  { path: 'qr-ads', component: QRAdsComponent },
  { path: 'wifi-ads', component: WifiAdsComponent },
  { path:'fr-kit', component: FrKitComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
