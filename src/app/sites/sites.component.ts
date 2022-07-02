import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css']
})
export class SitesComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.SiteTable();
  }

  tableData: any;
  
  SiteTable() {
    this.http.get('assets/JSON/siteData.json').subscribe(res=>{
      // console.log("Sites:: ",res);
      this.tableData = res;
    });
  }

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
  
  

  address: boolean = true;
  addressView() {
    this.address = !this.address;
  }

  threeDots: boolean = true;
  closeDot(e:any) {
    var x = e.target.parentNode.nextElementSibling;
    if(x.style.display =='none'){
      x.style.display ='flex';
    }else{
      x.style.display ='none';
    }
    // this.threeDots = !this.threeDots;
  }
}
