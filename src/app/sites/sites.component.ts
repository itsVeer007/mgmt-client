import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchPipe } from '../utilities/search.pipe';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css']
})
export class SitesComponent implements OnInit {

  // @HostListener('document:mousedown', ['$event']) onGlobalClick1(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`plus${this.currentid}`);
  //   console.log("ClosedId:: ",`plus${this.currentid}`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       if (x.style.display == 'flex' || x.style.display == 'block') {
  //         x.style.display = 'none';
  //       }
  //     }
  //   }

  //   var y = <HTMLElement>document.getElementById(`address${this.addressid}`);
  //   if (y != null) {
  //     if (!y.contains(e.target)) {
  //       if (y.style.display == 'flex' || y.style.display == 'block') {
  //         y.style.display = 'none';
  //       }
  //     }
  //   }

  //   var z = <HTMLElement>document.getElementById(`icons-site`);
  //   if (z != null) {
  //     if (!z.contains(e.target)) {
  //       this.icons1 = false;
  //     }
  //   }
  // }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.SiteTable();
  }

  showIconVertical: boolean = false;
  showIconCustomer: boolean = false;
  showIconSite: boolean = false;
  showIconCamera: boolean = false;
  showIconAnalytic: boolean = false;
  showIconUser: boolean = false;

  showIconView: boolean = false;
  showIconEdit: boolean = false;
  showIconDelete: boolean = false;
  showIconView1: boolean = false;
  showIconEdit1: boolean = false;
  showIconDelete1: boolean = false;

  searchText: any;
  tableData: any;

  SiteTable() {
    this.http.get('assets/JSON/siteData.json').subscribe(res => {
      // console.log("Sites:: ",res);
      this.tableData = res;
    });
  }


  // showAddCamera = false;
  // showAddCustomer = false;
  // showAddUser = false;
  // showAddBusinessVertical = false;
  showAddSite: boolean = false;
  showAddDevice: boolean = false;

  show(value: string) {
    if(value == 'site') {this.showAddSite = true}
    if(value == 'device') {this.showAddDevice = true}
  }

  closenow(type: string, value: any) {
    if (type == 'site') { this.showAddSite = value; }
    if (type == 'device') { this.showAddDevice = value; }

    // if (type == 'camr') { this.showAddCamera = value; }
    // if (type == 'cust') { this.showAddCustomer = value; }
    // if (type == 'vert') { this.showAddBusinessVertical = value; }
    // if (type == 'user') { this.showAddUser = value; }

    // console.log("SITES:: ",type)

    // setTimeout(() => {
    //   var openform = localStorage.getItem('opennewform');
    //   if (openform == 'showAddSite') { this.showAddSite = true; }
    //   if (openform == 'showAddDevice') { this.showAddDevice = true; }
    //   if (openform == 'showAddCamera') { this.showAddCamera = true; }
    //   if (openform == 'showAddCustomer') { this.showAddCustomer = true; }
    //   if (openform == 'showAddBusinessVertical') { this.showAddBusinessVertical = true; }
    //   if (openform == 'showAddUser') { this.showAddUser = true; }
    //   localStorage.setItem('opennewform', '');
    // }, 100)
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

  addressid = 0;
  addressView(e: any, i: any) {
    this.addressid = i;
    var x = e.target.nextElementSibling;
    // console.log("AddressView:: ",x)
    if (x.style.display == 'none') {
      x.style.display = 'flex';
    } else {
      x.style.display = 'none';
    }
    // this.address = !this.address;
  }

  currentid = 0;
  closeDot(e: any, i: any) {
    this.currentid = i;
    var x = e.target.parentNode.nextElementSibling;
    // console.log("Close-Click:: ",x);
    if (x.style.display == 'none') {
      x.style.display = 'flex';
    } else {
      x.style.display = 'none';
    }
  }

  masterSelected: boolean = false;
  // allcheck: boolean = false;
  SelectAll: boolean = false;


  // allchecked(e:any){

  //   if(document.querySelector('#allcheck:checked')){
  //     this.masterSelected = true;
  //     this.SelectAll =true;
  //   }else{
  //     this.masterSelected = false;
  //   }
  // }

  // itemchecked(e:any){
  //   if(document.querySelector('#allcheck:checked')){
  //     var x = (e.target.checked);
  //     console.log("ItemChecked:: ",x);
  //     if(x){
  //       this.SelectAll = true;
  //     }else{
  //       this.SelectAll = false;
  //     }
  //   }
  // }

  selectedAll: any;

  selectAll() {
    for (var i = 0; i < this.tableData.length; i++) {
      // console.log(this.tableData[i])
      this.tableData[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.tableData.every(function (item: any) {
      // console.log(item)
      return item.selected == true;
    })
  }

  sorted = false;
  sort(label:any){
    this.sorted = !this.sorted;
    var x = this.tableData;
    if(this.sorted==false){
      x.sort((a:string, b:string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    }else{
      x.sort((a:string, b:string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}


