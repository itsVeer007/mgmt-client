import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SiteService } from 'src/services/site.service';
import { MatDialog } from '@angular/material/dialog';
import { MetadataService } from 'src/services/metadata.service';
import { DeviceService } from 'src/services/device.service';

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

  showFiller = false;

  constructor(
    private http: HttpClient,
    private metaService: MetadataService,
    private siteSer: SiteService,
    private devService: DeviceService,
    public dialog: MatDialog
  ) { }

  tableData: any = [];
  showLoader: boolean = false;
  searchText: any;

  totalCount: any;
  active: any;
  inActive: any = [];
  onHold: any = [];

  showIconView: boolean = false;
  showIconEdit: boolean = false;
  showIconDelete: boolean = false;
  showIconView1: boolean = false;
  showIconEdit1: boolean = false;
  showIconDelete1: boolean = false;

  siteData: any;
  siteIds: any;
  deviceLength: any = [];
  // inputToAssets: any;
  ngOnInit(): void {
    this.getlistSites()
    this.ongetDeviceMode();
    this.siteData = JSON.parse(localStorage.getItem('temp_sites')!);
    this.siteIds = JSON.parse(localStorage.getItem('siteIds')!).sort((a: any, b: any) => a.siteid < b.siteid ? -1 : a.siteid > b.siteid ? 1 : 0);
    // this.myFun();
  }


  getlistSites() {
    this.showLoader = true;
    this.siteSer.listSites().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;

      this.tableData = res?.siteList?.sort((a: any, b: any) => a.siteid < b.siteid ? -1 : a.siteid > b.siteid ? 1 : 0);
      // this.inputToAssets = localStorage.setItem('siteIds', JSON.stringify(this.tableData))
      // this.totalCount = res.counts;
    })
  }

  // new: any = [];
  // myFun() {
  //   this.siteSer.listSites().subscribe((res: any) => {
  //     for(let item of res.sitesList) {
  //       this.new.push(item.siteId)
  //     }
  //   })

  //   this.devService.listDeviceAdsInfo().subscribe((res: any) => {
  //     console.log(res);
  //   });
  // }


  deviceData: any;
  inputToDevices: any;
  getDevices(siteId: any) {
    this.devService.listDeviceBySiteId(siteId).subscribe((res: any) => {
      this.deviceData = res.flatMap((item: any) => item.adsDevices);
      this.inputToDevices = this.deviceData;
      // console.log('site',this.inputToDevices);
    })
  }


  deviceMode: any;
  ongetDeviceMode() {
    // this.metaService.getDeviceMode({type: 'Device_Mode'}).subscribe((res: any) => {
    //   this.deviceMode = res.List_Shown_By_Type_Given;
    // })
  }

  engineerDetail: any;
  onGetEngineer(id: any) {
    this.siteSer.getEngineer(id).subscribe((res: any) => {
      this.engineerDetail = res.Engineer_details;
      // console.log(this.engineerDetail);
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
      // console.log(res)
    })
  }

  showAddSite: boolean = false;
  showAddDevice: boolean = false;

  show(value: string) {
    if(value == 'site') {this.showAddSite = true}
    if(value == 'device') {this.showAddDevice = true}
  }

  saveSiteData(site: any) {
    localStorage.setItem('temp_sites', JSON.stringify(site));
  }

  closenow(type: string, value: any) {
    if (type == 'site') { this.showAddSite = value }
    if (type == 'device') { this.showAddDevice = value }
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
  SelectAll: boolean = false;


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

  @ViewChild('viewSiteDialog') viewSiteDialog = {} as TemplateRef<any>;

  openViewPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.viewSiteDialog);
    // console.log(this.currentItem);
  }

  confirmViewRow() {
    // console.log(this.currentItem);
  }

  @ViewChild('editSiteDialog') editSiteDialog = {} as TemplateRef<any>;

  openEditPopup(item: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.dialog.open(this.editSiteDialog);
  }

  confirmEditRow() {
    // console.log(this.currentItem);
  }


  @ViewChild('deleteSiteDialog') deleteSiteDialog = {} as TemplateRef<any>;

  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteSiteDialog);
  }

  confirmDeleteRow() {
    // console.log(this.currentItem);
    this.tableData = this.tableData.filter((item: any) => item.siteId !== this.currentItem.siteId);
  }


  /* checkbox control */

  viewArray: any = [];
  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      this.dialog.open(this.viewSiteDialog)
    }
  }

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

  editArray: any = [];
  editBySelectedOne() {
    if (this.editArray.length > 0) {
      this.dialog.open(this.editSiteDialog);
    }
  }

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


