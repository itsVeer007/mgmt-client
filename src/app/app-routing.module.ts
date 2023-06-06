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
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AssetsComponent } from './assets/assets.component';
import { TicketsComponent } from './tickets/tickets.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { VerticalsComponent } from './verticals/verticals.component';
import { ReportsComponent } from './reports/reports.component';
import { MetaDataComponent } from './meta-data/meta-data.component';
import { TestComponent } from './test/test.component';
import { DevicesComponent } from './devices/devices.component';
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
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
    { path: 'assets', component: AssetsComponent },
    { path: 'tickets', component: TicketsComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'meta', component: MetaDataComponent },

    { path: 'test', component: TestComponent }
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
