import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  showAddSite = false;

  closenow(value:any) {
    this.showAddSite = value;
  }


  showAddCamera = false;

  closenow1(value:any) {
    this.showAddCamera = value;
  }

  showAddCustomer = false;

  closenow2(value:any) {
    this.showAddCustomer = value;
  }

  showAddUser = false;

  closenow3(value:any) {
    this.showAddUser = value;
  }

  showAddBusinessVertical = false;

  closenow4(value:any) {
    this.showAddBusinessVertical = value;
  }

  icons1:boolean = true;
  iconsnew1() {
    this.icons1=!this.icons1;
  }
  
  constructor() { }

  ngOnInit(): void {
  }

}
