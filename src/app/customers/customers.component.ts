import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  @HostListener('document:mousedown', ['$event']) onGlobalClick(e:any): void {
    var x = <HTMLElement>document.getElementById(`plus-img${this.currentid}`);
    console.log(`plus-img${this.currentid}`);
    // console.log(this.CustomerTable.length)
    if(!x.contains(e.target)){
      if(x.style.display == 'block') {
        x.style.display = 'none';
      }
    }


      // if(x.style.display == "none"){
      //   if(this.visibility){
      //     if (!this.popupmodal.nativeElement.contains(e.target)) {
      //       this.visibility=!this.visibility;
      //       this.calldisabled = true;
      //       this.time = null;
      //    }else{}
      //   }
      // }

  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.CustomerReport();
  }

  CustomerTable: any;
  CustomerReport() {
    this.http.get('assets/JSON/customerData.json').subscribe(res=>{
      console.log("CustomerReport::",res);
      this.CustomerTable = res;
    });
  }

  currentid=0;
  closeDot(e:any,i:any) {
    this.currentid= i;
    var x = e.target.parentNode.nextElementSibling;
    // console.log("THREE DOTS:: ",e.target.parentNode.nextElementSibling);
    if(x.style.display == 'none') {
      x.style.display = 'block';
    }else {
      x.style.display = 'none';
    }
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
  
 

}
