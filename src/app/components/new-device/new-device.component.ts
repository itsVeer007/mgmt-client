import { DatePipe } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { SensorDataComponent } from 'src/app/sensor-data/sensor-data.component';
import { AdvertisementsService } from 'src/services/advertisements.service';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { InventoryService } from 'src/services/inventory.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-new-device',
  templateUrl: './new-device.component.html',
  styleUrls: ['./new-device.component.css']
})
export class NewDeviceComponent {

  @Output() newItemEvent = new EventEmitter<boolean>();

  showLoader = false;
  constructor(
    private inventorySer: InventoryService,
    private adver: AdvertisementsService,
    private assetSer: AssetService,
    private siteSer: SiteService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public alertSer: AlertService,
    private storageSer: StorageService,
    private router: Router
  ) { }

  user:any;
  ngOnInit(): void {
    this.user = this.storageSer.get('user');
    this.listDeviceInfo()
    this.getSitesListForUserName()
    this.listDeviceAdsInfo();
    this.getStatus();
    // this.getData();
  }

  cameras: any = [];
  getCamerasForSiteId() {
    this.siteSer.getCamerasForSiteId(this.currentItem).subscribe((res: any) => {
      console.log(res);
      this.cameras = res;
    })
  }
  Active:any= [];
  inactive:any = [];
  newlistDeviceInfoData:any = [];
  listDeviceInfoData:any
  listDeviceInfo() {
    this.showLoader = true;
    this.adver.listDeviceInfo().subscribe((res:any)=> {
      console.log(res);
      this.showLoader = false
      this.listDeviceInfoData = res?.sites.flatMap((item:any)=>item.Devices)
      this.newlistDeviceInfoData = this.listDeviceInfoData
      console.log(this.newlistDeviceInfoData);
      for(let item of this.newlistDeviceInfoData) {
        if(item.active == 1) {
          this.Active.push(item)
        } else  if(item.active == 0) {
          this.inactive.push(item)
        }
      }
    })
  }

  // .sort((a:any, b:any) => b.active - a.active);
  @ViewChild('viewSiteDialog') viewSiteDialog = {} as TemplateRef<any>;
  openViewPopup(item:any) {
    this.currentItem = item;
    this.dialog.open(this.viewSiteDialog)
  }

  
  @ViewChild('editSiteDialog') editSiteDialog = {} as TemplateRef<any>;
  openEditPopup(item: any) {
    item.cameraId !== '0' ? this.cameraType = 1 : this.cameraType = 0;
    item.modifiedBy = this.user?.UserId
    this.currentItem = item;
    console.log(this.currentItem)
    this.getCamerasForSiteId()
    this.dialog.open(this.editSiteDialog);
  }

  cameraType: any ;

  getCurrentCamera(item:any) {
    this.currentItem.cameraId = item.cameraId
    this.currentItem.cameraName = item.name
    this.currentItem.cameraUrl = item.rtspUrl
  }

  updateDeviceDtl() {
    delete this.currentItem.modelObjectTypeId
    this.adver.updateDeviceInfo(this.currentItem).subscribe((res:any)=> {
      
      console.log(res);
      if(res?.statusCode == 200) {
        this.alertSer.success(res?.message)
      }
    },(error:any)=> {
      this.alertSer.error(error?.err?.message)
    })
  }

  @ViewChild('deleteSiteDialog') deleteSiteDialog = {} as TemplateRef<any>;
  DeletePopup(item:any) {
    this.currentItem = item
    this.dialog.open(this.deleteSiteDialog);
    
  }

  openDeletePopup() {
    console.log(this.currentItem)
    this.adver.deleteDevice(this.currentItem).subscribe((res:any)=> {
      console.log(res);
      if(res?.statusCode == 200) {
        this.alertSer.success(res?.message)
      }
    },(error:any)=> {
      this.alertSer.error(error?.err?.message)
    })
    this.listDeviceInfo()
  }

  showMore:boolean = false;
  showMore1:boolean = false;
  openMore(type:any) {
    if(type == 'more') {
      this.showMore = true
    }
    
  }

  openMore1(type:any) {
    if(type == 'more') {
      this.showMore1 = true
    }
    
  }

  @ViewChild('rebootDeviceDialog') rebootDeviceDialog = {} as TemplateRef<any>;
  openRebootDevice(item: any) {
    this.currentItem = item;
    this.dialog.open(this.rebootDeviceDialog);
  }

  rebootDevice(id: any) {
    this.alertSer.wait();
    this.adver.updateRebootDevice(id).subscribe((res: any) => {
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

  openAdver() {
    this.router.navigate(['/home/new-adver'])
  }















  siteId: any;
  deviceId: any

  // current:any
  // currentItem1:any;
  getDataForDevice:any = [];
  newGetDataForDevice:any = [];
  showLoader1: boolean = false
  getData(item:any) {
    this.showLoader1 = true;
    this.inventorySer.getData(item).subscribe((res:any)=> {
      // console.log(res);
      this.showLoader1 = false
      this.getDataForDevice = res;
      this.newGetDataForDevice = this.getDataForDevice;
      // this.getDataForDevice = res.flatMap((item:any)=> item.devices_data);
      // console.log(this.getDataForDevice)
    })
  }

  // openDialog(): void {
  //   this.getData();
  //   const dialogRef = this.dialog.open(SensorDataComponent,{

  //     width: '100%',
  //     height:'90vh'

  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });

  // }

    @ViewChild('sensorDialog') sensorDialog = {} as TemplateRef<any>
    openSensor() {
    this.siteId = this.tableData[0].siteId
    this.getData(this.newTableData[0])
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
    this.newlistDeviceInfoData = data;

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

  currentItem: any;
  currentWorkingDays: any;
  // @ViewChild('viewSiteDialog') viewSiteDialog = {} as TemplateRef<any>;
  // openViewPopup(item: any) {
  //   this.currentItem = item;
  //   this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
  //   this.dialog.open(this.viewSiteDialog);
  // }



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
