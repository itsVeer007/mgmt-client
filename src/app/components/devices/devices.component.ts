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
    this.listSites();
    this.listDevices();
    this.getStatus();
  }

  siteData: any = [];
  listSites() {
    this.showLoader = true;
    this.siteSer.listSites().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      this.getMetadata();
      if(res?.Status == 'Success') {
        this.siteData = res?.siteList?.sort((a: any, b: any) => a.siteid < b.siteid ? -1 : a.siteid > b.siteid ? 1 : 0);
        this.filterObj.siteId = this.siteData[this.siteData?.length - 1]?.siteid;
        this.filterDevices();
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
  listDevices() {
    this.showLoader = true;
    this.assetSer.listDeviceAdsInfo().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
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

  /* searches */
  siteSearch: any;
  searchSites(event: any) {
    this.siteSearch = (event.target as HTMLInputElement).value
  }

  filterObj = {
    siteId: null,
    deviceId: null,
  }

  filterDevices() {
    this.showLoader = true;
    this.assetSer.listDeviceAdsInfo1(this.filterObj).subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      this.newDeviceData = res.flatMap((item: any) => item.adsDevices);

      this.active = [];
      this.inActive = [];
      for(let item of this.newDeviceData) {
        if(item.status == 1) {
          this.active.push(item);
          // console.log(this.active)
        } else if(item.status == 2) {
          this.inActive.push(item);
        }
      }
    })
  }

  makeNull() {
    this.filterObj.deviceId = null;
  }

  statusNg: any = 'All';
  filterStatus(value: any) {
    if(value != 'All') {
      this.newDeviceData = this.deviceData.filter((el: any) => el.status == value);
    } else {
      this.newDeviceData = this.deviceData;
    }
    this.active = [];
    this.inActive = []
    for(let item of this.newDeviceData) {
      if(item.status == 1) {
        this.active.push(item);
      } else if(item.status == 2) {
        this.inActive.push(item);
      }
    }
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
    // console.log(id);
    this.y = id;
    this.dialog.open(this.editStatusDialog);
  }

  @ViewChild('viewSiteDialog') viewSiteDialog = {} as TemplateRef<any>;
  currentItem: any;
  currentWorkingDays: any;
  openViewPopup(item: any) {
    this.currentItem = item;
    // if(typeof(this.currentItem?.workingDays) === 'string') {
    //   let workingDays = this.currentItem?.workingDays?.split(',').map((item: any) => Number(item));
    //   this.currentItem.workingDays = workingDays;
    // } else {
    //   this.currentItem.workingDays = this.currentItem.workingDays
    // }

    this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
    this.dialog.open(this.viewSiteDialog);
  }

  @ViewChild('editSiteDialog') editSiteDialog = {} as TemplateRef<any>;
  originalObject: any;
  changedKeys: any[] = [];

  onRadioChange(event: any) {
    let x = event.source.name;
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onSelectChange(event: any) {
    let x = event.source.ngControl.name;
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onInputChange(event: any) {
    let x = event.target['name'];
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
    // console.log(this.changedKeys.length)
  }

  openEditPopup(item: any) {
    this.currentItem = item;
    this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
    this.dialog.open(this.editSiteDialog);
  }

  toAddDevice: any;
  onToAddDevice(e: any) {
    this.toAddDevice = e.value.length;
    // console.log(e.value.length)
  }

  updateDeviceDtl() {
    this.originalObject = {
      "deviceId": this.currentItem.deviceId,
      "deviceCallFreq": this.currentItem.deviceCallFreq,
      "deviceDescription": this.currentItem.deviceDescription,
      "remarks": this.currentItem.remarks,
      "weatherInterval": this.currentItem.weatherInterval,
      "loggerFreq": this.currentItem.loggerFreq,
      "modelWidth": this.currentItem.modelWidth,
      "modelHeight": this.currentItem.modelHeight,
      "deviceModeId": this.currentItem.deviceModeId,
      // "deviceTypeId": this.currentItem.deviceTypeId,
      "adsHours": this.currentItem.adsHours,
      "workingDays": this.currentItem.workingDays,
      "status": this.currentItem.status,
      "modelName": this.currentItem.modelName,
      "modelObjectTypeId": this.currentItem.modelObjectTypeId,
      "debugOn": this.currentItem.debugOn,
      "debugLogs": this.currentItem.debugLogs,
      "refreshRules": this.currentItem.refreshRules,
      "modifiedBy": 1,
    };

    if(this.changedKeys.length > 0) {
      this.alertSer.wait();
      let arr = this.currentWorkingDays.join(',');
      if(this.toAddDevice == 8) {
        var myString = arr.substring(1);
        this.originalObject.workingDays = myString;
      } else {
        this.originalObject.workingDays = arr;
      }
    }
    this.assetSer.updateDeviceAdsInfo({adsDevice: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      // console.log(res);
      this.listDevices();
      this.alertSer.success(res.message ? res.message : 'Device updated successfully');
    }, (err: any) => {
      this.alertSer.error(err?.error?.message);
    })
  }

  @ViewChild('createWorkingDays') createWorkingDays!: MatSelect;
  selectCreate: boolean = false;
  toggleCreateWorkingDays() {
    this.selectCreate = !this.selectCreate;
    if(this.selectCreate) {
      this.createWorkingDays?.options.forEach((item : MatOption) => item.select());
    } else {
      this.createWorkingDays?.options.forEach((item : MatOption) => item.deselect());
    }
  }

  @ViewChild('modifyWorkingDays') modifyWorkingDays!: MatSelect;
  selectModify: boolean = false;
  toggleModifyWorkingDays() {
    this.selectModify = !this.selectModify;
    if(this.selectModify) {
      this.modifyWorkingDays?.options.forEach((item : MatOption) => item.select());
    } else {
      this.modifyWorkingDays?.options.forEach((item : MatOption) => item.deselect());
    }
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
