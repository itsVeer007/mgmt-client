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
import { AuthGuard } from './utilities/auth/auth.guard';
import { ErrorPageComponent } from './utilities/error-page/error-page.component';
import { WifiAnalyticsComponent } from './wifi-analytics/wifi-analytics.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'main-dashboard', component: MainDashboardComponent, canActivate:[AuthGuard] },
  { path: 'verticals', component: VerticalsComponent, canActivate:[AuthGuard] },
  { path: 'add-new-site', component: AddNewSiteComponent, canActivate:[AuthGuard] },
  { path: 'add-new-camera', component: AddNewCameraComponent, canActivate:[AuthGuard] },
  { path: 'add-new-customer', component: AddNewCustomerComponent, canActivate:[AuthGuard] },
  { path: 'add-new-user', component: AddNewUserComponent, canActivate:[AuthGuard]},
  { path: 'add-new-business', component: AddNewBusinessVerticalComponent, canActivate:[AuthGuard]},
  { path: 'sites', component: SitesComponent, canActivate:[AuthGuard]},
  { path: 'devices', component: DevicesComponent, canActivate:[AuthGuard]},
  { path: 'analytics', component: AnalyticsComponent, canActivate:[AuthGuard]},
  { path: 'customers', component: CustomersComponent, canActivate:[AuthGuard]},
  { path: 'users', component: UsersComponent, canActivate:[AuthGuard]},
  { path: 'inventory', component: InventoryComponent, canActivate:[AuthGuard]},
  { path: 'product-master', component: ProductMasterComponent, canActivate:[AuthGuard]},
  { path: 'orders', component: OrdersComponent, canActivate:[AuthGuard]},
  { path: 'indents', component: IndentsComponent, canActivate:[AuthGuard]},
  { path: 'tickets', component: TicketsComponent, canActivate:[AuthGuard]},
  { path: 'ticket-reports', component: TicketReportsComponent, canActivate:[AuthGuard]},
  { path: 'fr', component: FrComponent, canActivate:[AuthGuard]},
  { path: 'assets', component: AssetsComponent, canActivate:[AuthGuard]},
  { path: 'advertisements', component: AdvertisementsComponent, canActivate:[AuthGuard]},
  { path: 'reports', component: ReportsComponent, canActivate:[AuthGuard]},
  { path: 'meta', component: MetaDataComponent, canActivate:[AuthGuard]},
  { path: 'vendors', component: VendorsComponent, canActivate:[AuthGuard]},
  { path: 'fr-reports', component: FrReportsComponent, canActivate:[AuthGuard]},
  { path: 'qr-ads', component: QRAdsComponent, canActivate:[AuthGuard]},
  { path: 'wifi-ads', component: WifiAdsComponent, canActivate:[AuthGuard]},
  { path:'fr-kit', component: FrKitComponent, canActivate:[AuthGuard]},
  { path:'wifi-analytics', component: WifiAnalyticsComponent, canActivate:[AuthGuard]},
  // { path: '**',  component: ErrorPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
