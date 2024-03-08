import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainDashboardComponent } from '../main-dashboard/main-dashboard.component';
import { AuthGuard } from '../utilities/auth/auth.guard';
import { AdvertisementsComponent } from '../components/advertisements/advertisements.component';
import { AnalyticsComponent } from '../components/analytics/analytics.component';
import { AssetsComponent } from '../components/assets/assets.component';
import { CustomersComponent } from '../components/customers/customers.component';
import { DevicesComponent } from '../components/devices/devices.component';
import { FrKitComponent } from '../components/fr-kit/fr-kit.component';
import { FrReportsComponent } from '../components/fr-reports/fr-reports.component';
import { FrComponent } from '../components/fr/fr.component';
import { IndentsComponent } from '../components/indents/indents.component';
import { InventoryComponent } from '../components/inventory/inventory.component';
import { MetaDataComponent } from '../components/meta-data/meta-data.component';
import { OrdersComponent } from '../components/orders/orders.component';
import { ProductMasterComponent } from '../components/product-master/product-master.component';
import { QRAdsComponent } from '../components/qr-ads/qr-ads.component';
import { SitesComponent } from '../components/sites/sites.component';
import { TicketReportsComponent } from '../components/ticket-reports/ticket-reports.component';
import { TicketsComponent } from '../components/tickets/tickets.component';
import { UsersComponent } from '../components/users/users.component';
import { VendorsComponent } from '../components/vendors/vendors.component';
import { VerticalsComponent } from '../components/verticals/verticals.component';
import { WifiAdsComponent } from '../components/wifi-ads/wifi-ads.component';
import { WifiAnalyticsComponent } from '../components/wifi-analytics/wifi-analytics.component';
import { AddNewBusinessVerticalComponent } from '../main-dashboard/add-new-business-vertical/add-new-business-vertical.component';
import { AddNewCameraComponent } from '../main-dashboard/add-new-camera/add-new-camera.component';
import { AddNewCustomerComponent } from '../main-dashboard/add-new-customer/add-new-customer.component';
import { AddNewSiteComponent } from '../main-dashboard/add-new-site/add-new-site.component';
import { AddNewUserComponent } from '../main-dashboard/add-new-user/add-new-user.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      // { path: '', component: MainDashboardComponent, redirectTo: 'home/main-dashboard', pathMatch: 'full' },
      { path: 'main-dashboard', component: MainDashboardComponent },
      { path: 'verticals', component: VerticalsComponent },
      { path: 'add-new-site', component: AddNewSiteComponent },
      { path: 'add-new-camera', component: AddNewCameraComponent },
      { path: 'add-new-customer', component: AddNewCustomerComponent },
      { path: 'add-new-user', component: AddNewUserComponent},
      { path: 'add-new-business', component: AddNewBusinessVerticalComponent},
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
      { path: 'meta', component: MetaDataComponent },
      { path: 'vendors', component: VendorsComponent },
      { path: 'fr-reports', component: FrReportsComponent },
      { path: 'qr-ads', component: QRAdsComponent },
      { path: 'wifi-ads', component: WifiAdsComponent },
      { path:'fr-kit', component: FrKitComponent },
      { path:'wifi-analytics', component: WifiAnalyticsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
providers: [AuthGuard]
})
export class MainRoutingModule { }
