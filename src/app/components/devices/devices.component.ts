import { DatePipe } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
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

  columns = [
    {
      id: 'siteId',
      label: 'site id',
      sort: true
    },
    {
      id: 'siteName',
      label: 'site name',
      sort: true
    },
    {
      id: 'deviceId',
      label: 'device id',
      sort: true
    },
    {
      id: 'firstConnected',
      label: 'first connected',
      sort: true
    },
    {
      id: 'lastTimeLastConnected',
      label: 'last connected',
      sort: true
    },
    {
      id: 'uptime',
      label: 'up time',
      sort: true
    },
    {
      id: 'downTime',
      label: 'down time',
      sort: true
    },
    {
      id: 'status',
      label: 'status',
      sort: true
    }
  ]

  @Output() newItemEvent = new EventEmitter<boolean>();

  constructor(
    private inventorySer: InventoryService,
    private assetSer: AssetService,
    private siteSer: SiteService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public alertSer: AlertService,
    private storageSer: StorageService
  ) { }

  showLoader = false;
  ngOnInit(): void {
    // this.getSitesListForUserName()
    // this.listDeviceAdsInfo();
    this.getStatus();
    // this.getData();
  }
  siteId: any;
  deviceId: any

  getDataForDevice: any = [];
  newGetDataForDevice: any = [];
  showLoader1: boolean = false
  getData(item: any) {
    this.showLoader1 = true;
    this.inventorySer.listSensorData(item).subscribe((res: any) => {
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
    if (site != 'All') {
      this.newTableData = this.tableData.filter((item: any) => item.siteId == site)
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
      if (res?.Status == 'Success') {
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
      this.showLoader = false;
      // this.getMetadata();
      this.deviceData = res.flatMap((item: any) => item.adsDevices);
      this.newDeviceData = this.deviceData;
    })
  }

  upTime: any;
  newData: any = [];
  getStatus() {
    this.showLoader = true;
    this.assetSer.getHealth().subscribe((res) => {
      this.showLoader = false;
      // this.upTime = res.flatMap((item: any) => item.on);
      // console.log(this.upTime[0]?.firstConnected.this.da - this.upTime[0]?.lastConnected)
      this.deviceData = res.DeviceHealthData;
      this.newDeviceData = this.deviceData;
      this.getDeviceStatus();
    }, (err) => {

    })
  }

  statusData: Array<any> = new Array();
  getDeviceStatus() {
    this.assetSer.devicesStatus().subscribe((res: any) => {
      this.statusData = res;
    })
  }

  getLiveStatus(data: any) {
    return this.statusData.filter((item) => {
      if (data.deviceId == item.UnitId) {
        return item.Status
      }
    })
  }

  getLoaderFromChild(data: boolean) {
    this.showLoader = data;
  }

  getDevicesFromChild(data: any) {
    this.newDeviceData = data;
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
      if (item.type == 2) {
        this.deviceType = item.metadata;
      } else if (item.type == 1) {
        this.deviceMode = item.metadata;
      } else if (item.type == 6) {
        this.workingDay = item.metadata;
      } else if (item.type == 10) {
        this.tempRange = item.metadata;
      } else if (item.type == 13) {
        this.ageRange = item.metadata;
      } else if (item.type == 7) {
        this.modelObjectType = item.metadata;
      } else if (item.type == 18) {
        this.model = item.metadata;
      } else if (item.type == 19) {
        this.modelResolution = item.metadata;
      } else if (item.type == 20) {
        this.softwareVersion = item.metadata;
      } else if (item.type == 21) {
        this.weatherInterval = item.metadata;
      } else if (item.type == 4) {
        this.deviceStatus = item.metadata;
      }
    })
  }

  @ViewChild('rebootDeviceDialog') rebootDeviceDialog = {} as TemplateRef<any>;
  openRebootDevice(item: any) {
    this.currentItem = item;
    // this.dialog.open(this.rebootDeviceDialog);
    this.alertSer.confirmDialog()
  }

  rebootDevice(id: any) {
    this.alertSer.wait();
    this.assetSer.updateRebootDevice(id).subscribe((res: any) => {
      // console.log(res)
      if (res) {
        this.alertSer.success(res?.message);
      }
    }, (err: any) => {
      if (err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }


  showAddDevice: boolean = false;
  showDeviceInfo: boolean = false;
  show(type: any) {
    if (type == 'device') { this.showAddDevice = true }
    if (type == 'device-info') { this.showDeviceInfo = true }
  }

  closenow(type: any) {
    if (type == 'device') { this.showAddDevice = false }
    if (type == 'device-info') { this.showDeviceInfo = false }
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
    // this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
    this.dialog.open(this.viewSiteDialog);
  }

  @ViewChild('editSiteDialog') editSiteDialog = {} as TemplateRef<any>;
  openEditPopup(item: any) {
    this.currentItem = item;
    // this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
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
