import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-edit-device-form',
  templateUrl: './edit-device-form.component.html',
  styleUrls: ['./edit-device-form.component.css']
})
export class EditDeviceFormComponent {

  @Input() currentItem: any;
  @Output() getDevices: any = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private assetSer: AssetService,
    private dropDown: MetadataService,
    private alertSer: AlertService,
    public dialog: MatDialog,
    private storageSer: StorageService,
    private siteSer: SiteService
  ) { }


  user: any;
  siteData: any
  currentWorkingDays: any;
  currentAdHours: any
  ngOnInit() {
    this.user = this.storageSer.get('user');
    this.siteData = this.storageSer.get('temp_sites');
    this.getMetadata();
    this.getCamerasForSiteId();
    this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
    this.currentAdHours = JSON.parse(JSON.stringify(this.currentItem.adsHours.split(',')));
  }

  cameras: any = [];
  getCamerasForSiteId() {
    this.siteSer.getCamerasForSiteId(this.currentItem?.siteid ? this.currentItem?.siteid : this.currentItem?.siteId).subscribe((res: any) => {
      this.cameras = res;
    })
  }

  checkBoxItems = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

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
  deviceCountry: any
  getMetadata() {
    this.dropDown.getMetadata().subscribe((res: any) => {
      for (let item of res) {
        if (item.type == 2) {
          this.deviceType = item.metadata;
        }
        else if (item.type == 1) {
          this.deviceMode = item.metadata;
        }
        else if (item.type == 6) {
          this.workingDay = item.metadata;
        }
        else if (item.type == 10) {
          this.tempRange = item.metadata;
        }
        else if (item.type == 13) {
          this.ageRange = item.metadata;
        }
        else if (item.type == 7) {
          this.modelObjectType = item.metadata;
        }
        else if (item.type == 18) {
          this.model = item.metadata;
        }
        else if (item.type == 19) {
          this.modelResolution = item.metadata;
        }
        else if (item.type == 20) {
          this.softwareVersion = item.metadata;
        }
        else if (item.type == 21) {
          this.weatherInterval = item.metadata;
        }
        else if (item.type == 4) {
          this.deviceStatus = item.metadata;
        }
        else if (item.type == 28) {
          this.deviceCountry = item.metadata;
        }
      }
    })
  }

  originalObject: any;
  changedKeys: any[] = [];
  checkedItems: any = []
  onCheckbox(data: any, event: any, index: number) {
    // this.currentAdHours.forEach((val: any) => {
    //   if (!this.checkedItems.includes(val)) {
    //     this.checkedItems.push(data);
    //   }
    // })

    if(event.checked && (!this.checkedItems.includes(data))) {
      this.checkedItems.push(data);
    } else {
      this.checkedItems.splice(index, 1);
    }

    // let final = this.currentAdHours;
    // if((!this.checkedItems.includes(...final))) {
    //   this.checkedItems.push(...final)
    // }
    console.log(this.currentAdHours.sort((a: any, b: any) => a > b ? 1 : a < b ? -1 : 0));
    console.log(this.checkedItems);

    let x = event.source.name;
    if (!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onRadioChange(event: any) {
    let x = event.source.name;
    if (!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onSelectChange(event: any) {
    let x = event.source.ngControl.name;
    if (!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onInputChange(event: any) {
    let x = event.target['name'];
    if (!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  cameraType: any = 0;
  finalAdHours: any = [];
  updateDeviceDtl() {
    this.originalObject = {
      "deviceId": this.currentItem.deviceId,
      "deviceCallFreq": this.currentItem.deviceCallFreq,
      "deviceDescription": this.currentItem.deviceDescription,
      "remarks": this.currentItem.remarks,
      "weatherInterval": this.currentItem.weatherInterval,
      // "loggerFreq": this.currentItem.loggerFreq,
      "modelWidth": this.currentItem.modelWidth,
      "modelHeight": this.currentItem.modelHeight,
      "deviceModeId": this.currentItem.deviceModeId,
      "softwareVersion": this.currentItem.softwareVersion,
      // "deviceTypeId": this.currentItem.deviceTypeId,
      "adsHours": this.currentItem.adsHours,
      "workingDays": this.currentItem.workingDays,
      "status": this.currentItem.status,
      "cameraId": this.currentItem.cameraId,
      "modelName": this.currentItem.modelName,
      "modelObjectTypeId": this.currentItem.modelObjectTypeId,
      "debugOn": this.currentItem.debugOn,
      "debugLogs": this.currentItem.debugLogs,
      "refreshRules": this.currentItem.refreshRules,
      "modifiedBy": this.user?.UserId,
    };

    if(this.cameraType === 0) {
      this.currentItem.cameraId = 0;
    }

    let final = this.currentAdHours.concat(this.checkedItems);
    this.originalObject.adsHours = final.sort((a: any, b: any) => a > b ? 1 : a < b ? -1 : 0).join(',');
    // this.originalObject.adsHours = this.currentAdHours.join(',') + ',' + this.checkedItems.join(',');

    this.currentItem.createdBy = this.user?.UserId;
    if (this.changedKeys.length > 0) {
      // this.alertSer.wait();
      // let arr = this.currentItem.workingDays.join(',');
      let arr = this.currentWorkingDays.join(',');
      if (this.toAddDevice == 8) {
        var myString = arr.substring(1);
        this.originalObject.workingDays = myString;
      } else {
        this.originalObject.workingDays = arr;
      }
    }
    this.assetSer.updateDeviceAdsInfo({adsDevice: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      this.getDevices.emit();
      this.alertSer.success(res.message ? res.message : 'Device updated successfully');
    }, (err: any) => {
      this.alertSer.error(err?.error?.message);
    })
  }

  /* create device */
  toAddDevice: any;
  isToogleClicked: boolean = false;
  onToAddDevice(e: any) {
    this.isToogleClicked = true;
    this.toAddDevice = e.value.length;
  }

}
