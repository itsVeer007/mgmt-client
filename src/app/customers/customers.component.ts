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
    // console.log(`plus-img${this.currentid}`);
    if(!x.contains(e.target)){
      if(x.style.display == 'flex' || x.style.display == 'block') {
        x.style.display = 'none';
      }
    }
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.CustomerReport();
  }

  CustomerTable: any;
  CustomerReport() {
    this.http.get('assets/JSON/customerData.json').subscribe(res=>{
      // console.log("CustomerReport::",res);
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
  showAddCamera = false;
  showAddCustomer = false;
  showAddUser = false;
  showAddBusinessVertical = false;
  // closenow(value:any) {
  //   this.showAddSite = value;
  // }

  closenow(value:any, type:String) {
    if(type=='site'){this.showAddSite = value;}
    if(type=='camr'){this.showAddCamera = value;}
    if(type=='cust'){this.showAddCustomer = value;}
    if(type=='vert'){this.showAddBusinessVertical = value;}
    if(type=='user'){this.showAddUser = value;}
    // console.log("SITES:: ",type)

    setTimeout(()=>{
      var openform = localStorage.getItem('opennewform');
      if(openform=='showAddSite'){this.showAddSite = true;}
      if(openform=='showAddCamera'){this.showAddCamera = true;}
      if(openform=='showAddCustomer'){this.showAddCustomer = true;}
      if(openform=='showAddBusinessVertical'){this.showAddBusinessVertical = true;}
      if(openform=='showAddUser'){this.showAddUser = true;}
      localStorage.setItem('opennewform', '');
    },100)
  }

  // showAddCamera = false;

  // closenow1(value:any) {
  //   this.showAddCamera = value;
  // }

  // showAddCustomer = false;

  // closenow2(value:any) {
  //   this.showAddCustomer = value;
  // }

  // showAddUser = false;

  // closenow3(value:any) {
  //   this.showAddUser = value;
  // }

  // showAddBusinessVertical = false;

  // closenow4(value:any) {
  //   this.showAddBusinessVertical = value;
  // }

  icons1:boolean = true;
  iconsnew1() {
    this.icons1=!this.icons1;
  }

  masterSelected:boolean = false;
  checklist: any;

  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    for (var i=0; i<this.CustomerReport.length; i++) {
      this.checklist[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  checkedList: any;
  // Get List of Checked Items
  getCheckedItemList(){
    this.checkedList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].isSelected)
      this.checkedList.push(this.checklist[i]);
    }
    this.checkedList = JSON.stringify(this.checkedList);
  }

}
