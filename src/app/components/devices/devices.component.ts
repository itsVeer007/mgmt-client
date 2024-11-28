import { DatePipe } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { InventoryService } from 'src/services/inventory.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';
import { UserService } from 'src/services/user.service';

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
      id: 'siteId',
      label: 'device id',
      sort: true
    },
    {
      id: 'siteId',
      label: 'first connected time',
      sort: true
    },
    // {
    //   id: 'lastTimeLastConnected',
    //   label: 'last connected',
    //   sort: true
    // },
    {
      id: 'siteId',
      label: 'device status',
      sort: true
    },
    {
      id: 'siteId',
      label: 'up / down time',
      sort: true
    },
    // {
    //   id: 'piTunnel',
    //   label: 'pi tunnel',
    //   sort: false
    // }
  ]

  @Output() newItemEvent = new EventEmitter<boolean>();

  constructor(
    private inventorySer: InventoryService,
    private assetSer: AssetService,
    private siteSer: SiteService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public alertSer: AlertService,
    private storageSer: StorageService,
    private userSer: UserService
  ) { }

  showLoader = false;
  timeSearches: any;
  deviceStatus: any;
  ngOnInit(): void {
    this.getSitesListForUserName()
    this.getStatus();
    // this.listDeviceAdsInfo();
    // this.getData();

    // console.log(this.userSer.can_getdata())

    setTimeout(() => {
        this.timeSearches = this.storageSer.getMetadataByType(109)[0].metadata;
        this.deviceStatus = this.storageSer.getMetadataByType(110)[0].metadata;
    }, 3000)
  }

  paramBody = {
    siteId: 'All',
    time: 'All',
    status: 'All',
  }
  deviceId: any;

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
    this.paramBody.siteId = this.tableData[0].siteId
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
      if (res.Status == 'Success') {
        this.tableData = res.sites?.sort((a: any, b: any) => a.siteId < b.siteId ? -1 : a.siteId > b.siteId ? 1 : 0);
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
  statusCounts: any = [];
  getStatus(data?: any) {
    this.showLoader = true;
    this.assetSer.getHealth(data).subscribe((res) => {
      this.showLoader = false;
      if(res.statusCode === 200) {
        this.statusCounts = res.DeviceHealthData.flatMap((item: any) => item.devicesData)
        this.deviceData = res.DeviceHealthData;
        this.newDeviceData = this.deviceData;
      } else {
        this.statusCounts = [];
        this.newDeviceData = [];
      }
      // this.getDeviceStatus();
    }, (err) => {

    })
  }

  statusData: Array<any> = new Array();
  getDeviceStatus() {
    this.assetSer.devicesStatus().subscribe((res: any) => {
      // console.log(res)
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
    this.newDeviceData = data.DeviceHealthData;
  }

  getDevicesFromChild1(data: any) {
    this.newGetDataForDevice = data;
  }

  getSearchFromChild(data: any) {
    this.searchText = data;
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
