import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { AddNewSiteComponent } from './main-dashboard/add-new-site/add-new-site.component'
import { AddNewCameraComponent } from './main-dashboard/add-new-camera/add-new-camera.component';
import { AddNewCustomerComponent } from './main-dashboard/add-new-customer/add-new-customer.component';
import { AddNewUserComponent } from './main-dashboard/add-new-user/add-new-user.component';
import { AddNewBusinessVerticalComponent } from './main-dashboard/add-new-business-vertical/add-new-business-vertical.component';
import { AuthGuard } from './utilities/auth/auth.guard';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { AdvertisementsComponent } from './components/advertisements/advertisements.component';
import { FrKitComponent } from './components/fr-kit/fr-kit.component';
import { LoginComponent } from './login/login.component';
import { VerticalsComponent } from './components/verticals/verticals.component';
import { SitesComponent } from './components/sites/sites.component';
import { AssetsComponent } from './components/assets/assets.component';
import { CustomersComponent } from './components/customers/customers.component';
import { DevicesComponent } from './components/devices/devices.component';
import { FrReportsComponent } from './components/fr-reports/fr-reports.component';
import { FrComponent } from './components/fr/fr.component';
import { IndentsComponent } from './components/indents/indents.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { MetaDataComponent } from './components/meta-data/meta-data.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductMasterComponent } from './components/product-master/product-master.component';
import { QRAdsComponent } from './components/qr-ads/qr-ads.component';
import { TicketReportsComponent } from './components/ticket-reports/ticket-reports.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { UsersComponent } from './components/users/users.component';
import { VendorsComponent } from './components/vendors/vendors.component';
import { WifiAdsComponent } from './components/wifi-ads/wifi-ads.component';
import { WifiAnalyticsComponent } from './components/wifi-analytics/wifi-analytics.component';

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
