import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchPipe } from '../utilities/search.pipe';
import { DropDownService } from 'src/services/drop-down.service';
import { SiteService } from 'src/services/site.service';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HasElementRef } from '@angular/material/core/common-behaviors/color';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css']
})
export class SitesComponent implements OnInit {

  @HostListener('document:mousedown', ['$event']) onGlobalClick1(e: any): void {
    var x = <HTMLElement>document.getElementById(`plus${this.currentid}`);
    if (x != null) {
      if (!x.contains(e.target)) {
        if (x.style.display == 'flex' || x.style.display == 'block') {
          x.style.display = 'none';
        }
      }
    }

    var y = <HTMLElement>document.getElementById(`address${this.addressid}`);
    if (y != null) {
      if (!y.contains(e.target)) {
        if (y.style.display == 'flex' || y.style.display == 'block') {
          y.style.display = 'none';
        }
      }
    }

    var z = <HTMLElement>document.getElementById(`engineer${this.engineerId}`);
    if (z != null) {
      if (!z.contains(e.target)) {
        if (z.style.display == 'flex' || z.style.display == 'block') {
          z.style.display = 'none';
        }
      }
    }

    // var z = <HTMLElement>document.getElementById(`icons-site`);
    // if (z != null) {
    //   if (!z.contains(e.target)) {
    //     this.icons1 = false;
    //   }
    // }
  }

  constructor(private http: HttpClient, private dropDown: DropDownService, private siteSer: SiteService, public dialog: MatDialog) { }

  tableData: any[] = [];
  searchText: any;
  totalCount: any;
  active: any;
  inActive: any[] = [];
  onHold: any[] = [];
  showLoader: boolean = false;

  showIconView: boolean = false;
  showIconEdit: boolean = false;
  showIconDelete: boolean = false;
  showIconView1: boolean = false;
  showIconEdit1: boolean = false;
  showIconDelete1: boolean = false;

  ngOnInit(): void {
    this.onGetSites()
    this.ongetDeviceMode();
    // this.x = JSON.parse(localStorage.getItem('tab_length')!)
  }

  onGetSites() {
    this.showLoader = true;
    this.siteSer.getSites().subscribe((res: any) => {
      this.showLoader = false;
      this.tableData = res.sitesList;
      this.totalCount = res.counts;
      console.log(this.totalCount)
      console.log(res);

      for(let item of res.counts) {
        if(item.title == "Active") {
          this.active = item.value
        } else if(item.title == "Active") {
          this.active = item.value
        }
        // if(item.status == "Active") {
        //   this.active.push(item);
        // } else if(item.status == "Inactive") {
        //   this.inActive.push(item);
        // } else if(item.status == "Onhold") {
        //   this.onHold.push(item);
        // }
      }
    })
  }


  deviceMode: any;
  ongetDeviceMode() {
    this.dropDown.getDeviceMode().subscribe((res: any) => {
      this.deviceMode = res.List_Shown_By_Type_Given;
    })
  }

  // showIconVertical: boolean = false;
  // showIconCustomer: boolean = false;
  // showIconSite: boolean = false;
  // showIconCamera: boolean = false;
  // showIconAnalytic: boolean = false;
  // showIconUser: boolean = false;

  engineerDetail: any;
  onGetEngineer(id: any) {
    this.siteSer.getEngineer(id).subscribe((res: any) => {
      this.engineerDetail = res.Engineer_details;
      console.log(this.engineerDetail);
    })
  }

  engineerId = 0;
  engineerView(e: any, i: any) {
    this.engineerId = i;
    var x = e.target.nextElementSibling;
    x.style.display == 'none' ? x.style.display = 'flex' : x.style.display = 'none';
  }

  onGetCentralboxDetail: any;
  onGetCentralbox(id: any) {
    this.siteSer.getCentralbox(id).subscribe((res: any) => {
      console.log(res)
    })
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

  saveSiteData(site: any) {
    localStorage.setItem('device_temp', JSON.stringify(site));
  }

  closenow(type: string, value: any) {
    if (type == 'site') { this.showAddSite = value }
    if (type == 'device') { this.showAddDevice = value }

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

  currentItem: any;

  //delete
  deletePopup: boolean = true;

  openDeletePopup(item: any, i: any) {
    this.currentItem = item;
    this.deletePopup = false;
  }

  confirmDeleteRow() {
    console.log("ToBE DELETED:: ", this.currentItem);
    this.tableData = this.tableData.filter((item: any) => item.siteId !== this.currentItem.siteId);
    this.deletePopup = true;
  }

  closeDeletePopup() {
    this.deletePopup = true;
  }

  deletearray: any = [];
  deleteMultiRecords(item: any, i: any, e: any) {
    var checked = (e.target.checked);
    // console.log("Delete Multiple Records:: ", item);
    if (this.deletearray.length == 0) { this.deletearray.push(item) }

    this.deletearray.forEach((el: any) => {
      if (el.siteId != item.siteId && checked) {
        this.deletearray.push(item);
        this.deletearray = [...new Set(this.deletearray.map((item: any) => item))]
      }
      if (el.siteId == item.siteId && !checked) {
        var currentindex = this.deletearray.indexOf(item);
        this.deletearray.splice(currentindex, 1)
      }
    });
    // console.log(this.deletearray)
  }

  deleteSelected() {
    if (this.selectedAll == false) {
      this.deletearray.forEach((el: any) => {
        this.tableData = this.tableData.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.tableData.forEach((el: any) => {
        this.tableData = this.tableData.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }


  //edit
  editPopup: boolean = true;

  openEditPopup(item: any, i: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.editPopup = false;
  }

  confirmEditRow() {
    console.log("TO BE EDITED:: ", this.currentItem);
    this.editPopup = true;
  }

  closeEditPopup() {
    this.editPopup = true;
  }

  editArray: any = [];
  EditByCheckbox(itemE: any, i: any, e: any) {
    var checked = (e.target.checked);
    if (checked == true && this.editArray.includes(itemE) == false) {
      this.editArray.push(itemE);
      this.currentItem = this.editArray[(this.editArray.length - 1)];
    }
    if (checked == false && this.editArray.includes(itemE) == true) {
      this.editArray.splice(this.editArray.indexOf(itemE), 1)
    }
  }

  editBySelectedOne() {
    if (this.editArray.length > 0) {
      this.editPopup = false;
    }
  }

  //view
  viewPopup: boolean = true;

  openViewPopup(item: any, i: any) {
    this.currentItem = item;
    console.log("VIEW PAGE:: ", this.currentItem);
    this.viewPopup = false;
  }

  confirmViewRow() {
    console.log("ToBE Viewed:: ", this.currentItem);
    this.viewPopup = true;
  }

  closeViewPopup() {
    this.viewPopup = true;
  }

  viewArray: any = [];
  ViewByCheckbox(itemV: any, i: any, e: any) {
    var checked = (e.target.checked);
    // console.log("View By Checkbox:: ",itemV);
    // console.log("View Array::" ,this.viewArray);
    // console.log("present in array : "+this.viewArray.includes(itemV),  " checked : "+ checked)
    if (checked == true && this.viewArray.includes(itemV) == false) {
      this.viewArray.push(itemV);
      this.currentItem = this.viewArray[(this.viewArray.length - 1)];
    }
    if (checked == false && this.viewArray.includes(itemV) == true) {
      this.viewArray.splice(this.viewArray.indexOf(itemV), 1)
    }
  }

  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      this.viewPopup = false;
    }
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

  // openDialog() {
  //   this.dialog.open(pop);
  // }

}


