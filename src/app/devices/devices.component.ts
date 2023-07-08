import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { DeviceService } from 'src/services/device.service';
import { MetadataService } from 'src/services/metadata.service';
import { TicketService } from 'src/services/ticket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    var x = <HTMLElement>document.getElementById(`plus-img${this.currentid}`);
    var y = <HTMLElement>document.getElementById(`icons-site`);

    // console.log(`plus-img${this.currentid}`);
    if (x != null) {
      if (!x.contains(e.target)) {
        if (x.style.display == 'flex' || x.style.display == 'block') {
          x.style.display = 'none';
        }
      }
    }

    // if (y != null) {
    //   console.log(`icons-site`);
    //   if (!y.contains(e.target)) {
    //     this.icons1 = false;
    //   }
    // }
  }




  showLoader = false;
  constructor(
    private http: HttpClient,
    private ticketSer: TicketService,
    private devService: DeviceService,
    private metadataSer: MetadataService,

    public dialog: MatDialog,
    public datePipe: DatePipe,
    public alertSer: AlertService
  ) { }

  siteData: any
  ngOnInit(): void {
    this.CustomerReport();
    this.getStatus();
    this.onMetadataChange();
    this.siteData = JSON.parse(localStorage.getItem('siteIds')!);
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
  deviceData: any = [];
  xx: any;

  active: any = [];
  inActive: any = [];
  CustomerReport() {
    this.showLoader = true;
    this.devService.listDeviceAdsInfo().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      let x = res.flatMap((item: any) => item.adsDevices);
      this.deviceData = x;
      // localStorage.setItem('deviceData', JSON.stringify(x));

      for(let item of this.deviceData) {
        if(item.status == 1) {
          this.active.push(item);
        } else if(item.status == 2) {
          this.inActive.push(item);
        }
      }
    })
  }

  upTime: any;
  getStatus() {
    this.devService.getHealth().subscribe((res: any) => {
      this.upTime = res.flatMap((item: any) => item.on);
      // console.log(this.upTime[0]?.firstConnected.this.da - this.upTime[0]?.lastConnected)
    })
  }

  filterSiteId: any
  filterSiteId_Name(value: any) {
    this.filterSiteId = this.deviceData.filter((el: any) => el.siteId_Name == value)
  }

  filterDevice: any
  filterDeviceType(value: any) {
    this.filterDevice = this.deviceData.filter((el: any) => el.deviceType == value)
  }

    /* metadata methods */

    deviceType: any;
    deviceMode: any;
    workingDay: any;
    tempRange: any;
    ageRange: any;
    modelObjectType: any;
    model: any;
    modelResolution: any;
    softwareVersion: any;
    weatherInterval: any;
    deviceStatus: any
    onMetadataChange() {
      this.metadataSer.getMetadata().subscribe((res: any) => {
        for(let item of res) {
          if(item.type == 'Device_Type') {
            this.deviceType = item.metadata;
          }
          else if(item.type == 'Device_Mode') {
            this.deviceMode = item.metadata;
          }
          else if(item.type == 'Working_Day') {
            this.workingDay = item.metadata;
          }
          else if(item.type == 'Ads_Temp_Range') {
            this.tempRange = item.metadata;
          }
          else if(item.type == 'Ads_Age_Range') {
            this.ageRange = item.metadata;
          }
          else if(item.type == 'model_object_type') {
            this.modelObjectType = item.metadata;
          }
          else if(item.type == 'Model') {
            this.model = item.metadata;
          }
          else if(item.type == 'Model Resolution') {
            this.modelResolution = item.metadata;
          }
          else if(item.type == 'Ads_Software_Version') {
            this.softwareVersion = item.metadata;
          }
          else if(item.type == 'Weather_Interval') {
            this.weatherInterval = item.metadata;
          }
          else if(item.type == 'Device_Status') {
            this.deviceStatus = item.metadata;
          }
        }
      })
    }

  rebootDevice(id: any) {
    this.alertSer.wait();

    this.devService.updateRebootDevice(id).subscribe((res: any) => {
      // console.log(res)
      if(res) {
        this.alertSer.success(res);
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error();
      };
    });
  }


  currentid = 0;
  closeDot(e: any, i: any) {
    this.currentid = i;
    var x = e.target.parentNode.nextElementSibling;
    // console.log("THREE DOTS:: ",e.target.parentNode.nextElementSibling);
    if (x.style.display == 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  }

  showAddSite = false;
  showAddCamera = false;
  showAddCustomer = false;
  showAddUser = false;
  showAddBusinessVertical = false;
  showSite = false;
  // closenow(value:any) {
  //   this.showAddSite = value;
  // }

  showAddDevice: boolean = false;

  show(type: any) {
    if (type == 'device') { this.showAddDevice = type }
  }

  closenow(type: any, e: any) {
    if(type == 'device') {this.showAddDevice = e}
  }

  masterSelected: boolean = false;

  // allchecked(e:any){
  //   if(document.querySelector('#allchecked:checked')){
  //     this.masterSelected = true;
  //   }else {
  //     this.masterSelected = false;
  //   }
  // }

  selectedAll: any;

  selectAll() {
    for (var i = 0; i < this.deviceData.length; i++) {
      // console.log(this.deviceData[i])
      this.deviceData[i].selected = this.selectedAll;
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.deviceData.every(function (item: any) {
      // console.log(item)
      return item.selected == true;
    })
  }


  deleteRow: any;

  deleteRow1(item: any, i: any) {
    // console.log(item);
    this.showLoader = true;
    setTimeout(() => {
      this.showLoader = false;
      this.deviceData.splice(i, 1);
    }, 1000);
  }

  deletePopup: boolean = true;
  currentItem: any;


  editPopup: boolean = true;
  originalObject: any;
  // changedKeys: any[] = [];

  openEditPopup(item: any, i: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.editPopup = false;
    // console.log(this.currentItem);
  }

  // confirmEditRow(event: any) {
  //   this.originalObject = {
  //     "ticketId": this.currentItem.ticketId,
  //     "site": this.currentItem.site,
  //     "description": this.currentItem.description,
  //     "priority": this.currentItem.priority,
  //     "status": this.currentItem.status,
  //   };

  //   let x = event.target['name'];

  //   if(!(this.changedKeys.includes(x))) {
  //     this.changedKeys.push(x);
  //   }
  //   console.log(this.changedKeys);
  //   console.log(this.originalObject);
  //   console.log( this.currentItem);
  //   this.editPopup = true;
  //   this.CustomerReport();
  // }


  updateTicket(el: any) {

    this.originalObject = {
      "ticketId": el.ticketId,
      "site": el.site,
      "siteId": 1102,
      "description": el.description,
      "priority": el.priority,
      "status": el.status,
    };
    this.alertSer.wait();

    this.ticketSer.updateTicket(this.originalObject).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res);
      }
      setTimeout(() => {
        window.location.reload();
      }, 3000)
    }, (err: any) => {
      if(err) {
        this.alertSer.error();
      };
    });
  }

  assignedObj = {
    assignedTo: ""
  }

  @ViewChild('assignedDialog') assignedDialog = {} as TemplateRef<any>;

  x: any
  openAssigned(item: any) {
    // console.log(item);
    this.x = item;
    this.dialog.open(this.assignedDialog);
  }

  toAssigned() {
    let myObj = {
      'ticketId': this.x.ticketId,
      'assignedTo': this.assignedObj.assignedTo
    }

    this.ticketSer.assignPerson(myObj).subscribe((res: any) => {
      // console.log(res)
    })
  }

  @ViewChild('editStatusDialog') editStatusDialog = {} as TemplateRef<any>;

  y: any
  openEditStatus(id: any) {
    // console.log(id);
    this.y = id;
    this.dialog.open(this.editStatusDialog);
  }

  staObj = {
    status: ""
  }


  changeAssetStatus() {
    let statusObj = {
      ticketId: this.y.ticketId,
      status: this.staObj.status
    }

    this.ticketSer.updateStatus(statusObj).subscribe((res: any) => {
      // console.log(res);
    })
  }


  openDeletePopup(item: any, i: any) {
    this.currentItem = item;
    this.deletePopup = false;
    // console.log(item);
  }

  confirmDeleteRow() {
    // console.log(this.currentItem);
    // this.deviceData = this.deviceData.filter((item: any) => item.siteId !== this.currentItem.siteId);
    this.deletePopup = true;

    this.ticketSer.deleteTicket(this.currentItem).subscribe((res: any) => {
      // console.log(res);
    })
  }

  closeDeletePopup() {
    this.deletePopup = true;
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
    this.CustomerReport();
  }


  viewPopup: boolean = true;

  confirmViewRow() {
    // console.log(this.currentItem);
    this.viewPopup = true;
  }

  closeViewPopup() {
    this.viewPopup = true;
  }

  openViewPopup(item: any, i: any) {
    this.currentItem = item;
    // console.log(this.currentItem);
    this.viewPopup = false;
  }

  viewArray: any = [];
  ViewByCheckbox(itemV: any, i: any, e: any) {
    var checked = (e.target.checked);
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
        // this.currentItem = el;
        // this.confirmDeleteRow();
        this.deviceData = this.deviceData.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.deviceData.forEach((el: any) => {
        this.deviceData = this.deviceData.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }


  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.deviceData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}
