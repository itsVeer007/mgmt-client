import { DatePipe } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { InventoryService } from 'src/services/inventory.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<boolean>();

  showLoader = false;
  constructor(
    private inventorySer: InventoryService,
    private assetSer: AssetService,
    private siteSer: SiteService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public alertSer: AlertService,
    private storageSer: StorageService
  ) { }

  ngOnInit(): void {
    this.listDeviceAdsInfo();
    this.getStatus();
    this.getSitesListForUserName()
  }

  getDataForDevice:any;
  newGetDataForDevice:any;
  getData() {
    this.inventorySer.getData().subscribe((res:any)=> {
      // console.log(res);
      this.getDataForDevice = res;
      this.newGetDataForDevice = this.getDataForDevice;
      // this.getDataForDevice = res.flatMap((item:any)=> item.devices_data);
      // console.log(this.getDataForDevice)
    })
  }

  @ViewChild('sensorDialog') sensorDialog = {} as TemplateRef<any>
  openSensor() {
    this.getData();
    this.dialog.open(this.sensorDialog);
  }

   /* searches */
   siteSearch: any;
   siteNg: any = 'All'
   searchSites(event: any) {
     this.siteSearch = (event.target as HTMLInputElement).value
   }

   filterSites(site: any) {
    if(site != 'All') {
      this.newTableData =  this.tableData.filter((item: any) => item.siteId == site)
    } else {
      this.newTableData = this.tableData;
    }
  }

  tableData: any = [];
  newTableData: any = [];

  getSitesListForUserName() {
    this.showLoader = true;
    this.siteSer.getSitesListForUserName().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      if(res?.Status == 'Success') {
        this.tableData = res?.sites?.sort((a: any, b: any) => a.siteId < b.siteId ? -1 : a.siteId > b.siteId ? 1 : 0);
        this.newTableData = this.tableData;
      }
      }, (err: any) => {
        this.showLoader = false;
    });
  }

  searchText: any;
  deviceData: any = [];
  newDeviceData: any = [];
  active: any = [];
  inActive: any = [];
  listDeviceAdsInfo() {
    this.showLoader = true;
    this.assetSer.listDeviceAdsInfo().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      this.getMetadata();
      this.deviceData = res.flatMap((item: any) => item.adsDevices);
      this.newDeviceData = this.deviceData;
      this.active = [];
      this.inActive = []
      for(let item of this.newDeviceData) {
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
    this.assetSer.getHealth().subscribe((res: any) => {
      this.upTime = res.flatMap((item: any) => item.on);
      // console.log(this.upTime[0]?.firstConnected.this.da - this.upTime[0]?.lastConnected)
    })
  }

  getLoaderFromChild(data: boolean) {
    this.showLoader = data;
  }

  getDevicesFromChild(data: any) {
    this.newDeviceData = data;

    this.active = [];
    this.inActive = [];
    for(let item of data) {
      if(item.status == 1) {
        this.active.push(item);
      } else if(item.status == 2) {
        this.inActive.push(item);
      }
    }
  }

  getDevicesFromChild1(data: any) {
    this.newGetDataForDevice = data;
    console.log(data)
  }

  getSearchFromChild(data: any) {
    this.searchText = data;
  }

  /* metadata */
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
  deviceStatus: any;
  getMetadata() {
    let data = this.storageSer.get('metaData');;
    data?.forEach((item: any) => {
      if(item.type == 2) {
        this.deviceType = item.metadata;
      } else if(item.type == 1) {
        this.deviceMode = item.metadata;
      } else if(item.type == 6) {
        this.workingDay = item.metadata;
      } else if(item.type == 10) {
        this.tempRange = item.metadata;
      } else if(item.type == 13) {
        this.ageRange = item.metadata;
      } else if(item.type == 7) {
        this.modelObjectType = item.metadata;
      } else if(item.type == 18) {
        this.model = item.metadata;
      } else if(item.type == 19) {
        this.modelResolution = item.metadata;
      } else if(item.type == 20) {
        this.softwareVersion = item.metadata;
      } else if(item.type == 21) {
        this.weatherInterval = item.metadata;
      } else if(item.type == 4) {
        this.deviceStatus = item.metadata;
      }
    })
  }

  @ViewChild('rebootDeviceDialog') rebootDeviceDialog = {} as TemplateRef<any>;
  openRebootDevice(item: any) {
    this.currentItem = item;
    this.dialog.open(this.rebootDeviceDialog);
  }

  rebootDevice(id: any) {
    this.alertSer.wait();
    this.assetSer.updateRebootDevice(id).subscribe((res: any) => {
      // console.log(res)
      if(res) {
        this.alertSer.success(res?.message);
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }


  showAddDevice: boolean = false;
  showDeviceInfo: boolean = false;
  show(type: any) {
    if(type == 'device') { this.showAddDevice = true }
    if(type == 'device-info') { this.showDeviceInfo = true }
  }

  closenow(type: any) {
    if(type == 'device') {this.showAddDevice = false}
    if(type == 'device-info') {this.showDeviceInfo = false}
  }

  @ViewChild('editStatusDialog') editStatusDialog = {} as TemplateRef<any>;
  y: any
  openEditStatus(id: any) {
    this.y = id;
    this.dialog.open(this.editStatusDialog);
  }

  @ViewChild('viewSiteDialog') viewSiteDialog = {} as TemplateRef<any>;
  currentItem: any;
  currentWorkingDays: any;
  openViewPopup(item: any) {
    this.currentItem = item;
    this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
    this.dialog.open(this.viewSiteDialog);
  }

  @ViewChild('editSiteDialog') editSiteDialog = {} as TemplateRef<any>;
  openEditPopup(item: any) {
    this.currentItem = item;
    this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
    this.dialog.open(this.editSiteDialog);
  }


  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.newDeviceData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}
