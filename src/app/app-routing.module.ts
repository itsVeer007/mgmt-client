import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { AddNewSiteComponent } from './dashboard/add-new-site/add-new-site.component'
import { AddNewCameraComponent } from './dashboard/add-new-camera/add-new-camera.component';
import { AddNewCustomerComponent } from './dashboard/add-new-customer/add-new-customer.component';
import { AddNewUserComponent } from './dashboard/add-new-user/add-new-user.component';
import { AddNewBusinessVerticalComponent } from './dashboard/add-new-business-vertical/add-new-business-vertical.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
    {path:'', redirectTo:'main-dashboard', pathMatch:'full'},
    {path:'main-dashboard', component:MainDashboardComponent},
    {path:'add-new-site', component:AddNewSiteComponent},
    {path:'add-new-camera', component:AddNewCameraComponent},
    {path:'add-new-customer', component:AddNewCustomerComponent},
    {path:'add-new-user', component:AddNewUserComponent},
    {path:'add-new-business', component:AddNewBusinessVerticalComponent}
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
