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

  sites:any = [];
  Active:any= [];
  inactive:any = [];
  newlistDeviceInfoData:any = [];
  listDeviceInfoData:any
  listDeviceInfo() {
    this.showLoader = true;
    this.adver.listDeviceInfo().subscribe((res:any)=> {
      console.log(res);
      this.getMetadata();
      this.showLoader = false
      this.sites = res?.sites
      this.listDeviceInfoData = res?.sites.flatMap((item:any)=>item.Devices)
      this.newlistDeviceInfoData = this.listDeviceInfoData;
      // console.log(this.newlistDeviceInfoData);
      for(let item of this.newlistDeviceInfoData) {
        if(item.active == 1) {
          this.Active.push(item)
        } else  if(item.active == 0) {
          this.inactive.push(item)
        }
      }
    })
  }

  closenow(){
    this.newItemEvent.emit()
  }

  siteId:any = 'All';
  deviceId: any = "All";
  deviceTypeId:any

  filter(type:any) {
    let siteId:any
    let deviceId:any;
    this.siteId == 'All' ? siteId = null : siteId = this.siteId;
    this.deviceId == 'All' ? deviceId = null : deviceId = this.deviceId;
  

    if(type == 'All') {
      this.newlistDeviceInfoData = this.listDeviceInfoData
    } else {
      this.adver.listDeviceInfo({siteId:siteId, deviceId:deviceId, deviceTypeId:  this.deviceTypeId}).subscribe((res:any)=> {
        this.newlistDeviceInfoData = res?.sites.flatMap((item:any)=>item.Devices)
      })
    }
  }





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
  currentItem: any;

  getCurrentCamera(item:any) {
    this.currentItem.cameraId = item.cameraId
    this.currentItem.cameraName = item.name
    this.currentItem.cameraUrl = item.rtspUrl
  }

  updateDeviceDtl() {
    delete this.currentItem.modelObjectTypeId
    delete this.currentItem.cameraName
    delete this.currentItem.cameraUrl
    delete this.currentItem.siteName
    delete this.currentItem.deviceTypeId
    
    this.adver.updateDeviceInfo(this.currentItem).subscribe((res:any)=> {
      
      console.log(res);
      if(res?.statusCode == 200) {
        this.alertSer.success(res?.message)
      } else {
        this.alertSer.error(res?.message)
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


  openView:boolean = false;
  openAdver(type:any) {
    if(type == 'view') {
      this.openView = true;
    }
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

   
  }

  getDevicesFromChild1(data: any) {
    // this.newGetDataForDevice = data;
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
    let data = this.storageSer.get('metaData');
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
        console.log(this.deviceStatus)
      }
    })
  }



  data:any
  showAddDevice: boolean = false;
  showDeviceInfo: boolean = false;
  show(type: any, value?:any) {
    this.data = value;
    if(type == 'asset') {
       this.showAddDevice = true 
      }
    if(type == 'device') {
       this.showDeviceInfo = true 
      }
  }

  close(type: any) {
    if(type == 'asset') {
      this.showAddDevice = false
    }
    if(type == 'device') {
      this.showDeviceInfo = false
    }
  }

  @ViewChild('editStatusDialog') editStatusDialog = {} as TemplateRef<any>;
  y: any
  openEditStatus(id: any) {
    this.y = id;
    this.dialog.open(this.editStatusDialog);
  }

  
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
    var x = this.newlistDeviceInfoData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}
