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
  @Output() newItemEvent = new EventEmitter<boolean>();

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
    this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
    this.currentAdHours = JSON.parse(JSON.stringify(this.currentItem.adsHours.split(',')));
    console.log(this.currentAdHours)
  }

  cameras: any = [];
  getCamerasForSiteId() {
    this.siteSer.getCamerasForSiteId(this.siteData?.siteid).subscribe((res: any) => {
      this.cameras = res;
    })
  }

  checkBoxItems = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '0-23'];
  // first: any = '00';
  toppings = this.fb.group({
    '00': '00',
    '01': false,
    '02': false,
    '03': false,
    '04': false,
    '05': false,
    '06': false,
    '07': false,
    '08': false,
    '09': false,
    '10': false,
    '11': false,
    '12': false,
    '13': false,
    '14': false,
    '15': false,
    '16': false,
    '17': false,
    '18': false,
    '19': false,
    '20': false,
    '21': false,
    '22': false,
    '23': false,
  });


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
    deviceStatus: any;
    deviceCountry: any
    getMetadata() {
      this.dropDown.getMetadata().subscribe((res: any) => {
        for(let item of res) {
          if(item.type == 2) {
            this.deviceType = item.metadata;
          }
          else if(item.type == 1) {
            this.deviceMode = item.metadata;
          }
          else if(item.type == 6) {
            this.workingDay = item.metadata;
          }
          else if(item.type == 10) {
            this.tempRange = item.metadata;
          }
          else if(item.type == 13) {
            this.ageRange = item.metadata;
          }
          else if(item.type == 7) {
            this.modelObjectType = item.metadata;
          }
          else if(item.type == 18) {
            this.model = item.metadata;
          }
          else if(item.type == 19) {
            this.modelResolution = item.metadata;
          }
          else if(item.type == 20) {
            this.softwareVersion = item.metadata;
          }
          else if(item.type == 21) {
            this.weatherInterval = item.metadata;
          }
          else if(item.type == 4) {
            this.deviceStatus = item.metadata;
          }
          else if(item.type == 28) {
            this.deviceCountry = item.metadata;
          }
        }
      })
    }

  originalObject: any;
  changedKeys: any[] = [];
  checkedItems: any = []
  onCheckbox(data: any, event: any) {
    // console.log(event)
    if(event.checked) {
      this.checkedItems.push(data);
    }
    let x = event.source.name;
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

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
  }

  /* update device */
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
      "softwareVersion": this.currentItem.softwareVersion,
      // "deviceTypeId": this.currentItem.deviceTypeId,
      "adsHours": this.currentItem.adsHours,
      "workingDays": this.currentItem.workingDays,
      "status": this.currentItem.status,
      "modelName": this.currentItem.modelName,
      "modelObjectTypeId": this.currentItem.modelObjectTypeId,
      "debugOn": this.currentItem.debugOn,
      "debugLogs": this.currentItem.debugLogs,
      "refreshRules": this.currentItem.refreshRules,
      "modifiedBy": this.user?.UserId,
    };

    this.originalObject.adsHours = this.checkedItems.join(',');
    this.currentItem.createdBy = this.user?.UserId;
    if(this.changedKeys.length > 0) {
      // this.alertSer.wait();
      // let arr = this.currentItem.workingDays.join(',');
      let arr = this.currentWorkingDays.join(',');
      if(this.toAddDevice == 8) {
        var myString = arr.substring(1);
        this.originalObject.workingDays = myString;
      } else {
        this.originalObject.workingDays = arr;
      }
    }
    // this.newItemEvent.emit();
    // this.assetSer.updateDeviceAdsInfo({adsDevice: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
    //   this.alertSer.success(res?.message ? res?.message : 'Device updated successfully');
    // }, (err: any) => {
    //   this.alertSer.error(err?.error?.message);
    // })
  }

  /* create device */
  toAddDevice: any;
  isToogleClicked: boolean = false;
  onToAddDevice(e: any) {
    this.isToogleClicked = true;
    this.toAddDevice = e.value.length;
    // console.log(e.value.length)
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

}
