import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)", }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})

export class AddDeviceComponent implements OnInit {
  @Input() fromSites: any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  addDevice: any =  FormGroup;
  searchText: any;

  constructor(
    private fb: FormBuilder,
    private assetSer: AssetService,
    private dropDown: MetadataService,
    private alertSer: AlertService,
    public dialog: MatDialog,
    private storageSer: StorageService,
    private siteSer: SiteService
  ) { }

  siteData: any;
  adInfo: any = {
    siteId: null,
    deviceDescription: '',
    deviceTypeId: null,
    deviceCallFreq: 1,
    deviceModeId: null,
    deviceLocId: null,
    adsHours: '',
    workingDays: ['',0,1,2,3,4,5,6],
    createdBy: null,
    softwareVersion: 'v1.0.1',
    socketServer: 'ec2-18-213-63-73.compute-1.amazonaws.com',
    socketPort: 6666,
    remarks: '',
    weatherInterval: null, //BSR
    cameraId: null, //ODR
    modelName: 'Yolov8', //ODR
    modelWidth: 640, //ODR
    modelHeight: 720, //ODR
    modelMaxResults: 3, //ODR
    modelThreshold: 0.6, //ODR
    modelObjectTypeId: null, //ODR
    refreshRules: 0,  //ODR
    debugOn: 0,  //ODR
    debugLogs: 0, //ODR
    loggerFreq: 60,  //ODR
  }

  user: any;
  ngOnInit() {
    this.siteData = this.storageSer.get('temp_sites');
    this.user = this.storageSer.get('user');

    this.addDevice = this.fb.group({
      'deviceDescription': new FormControl('', Validators.required),
      'deviceTypeId': new FormControl('', Validators.required),
      'deviceCallFreq': new FormControl('', Validators.required),
      'deviceModeId': new FormControl('', Validators.required),
      'deviceLocId': new FormControl('', Validators.required),
      'adsHours': new FormControl(''),
      'workingDays': new FormControl('', Validators.required),
      'createdBy': new FormControl(''),
      'softwareVersion': new FormControl(''),
      'socketServer': new FormControl(''),
      'socketPort': new FormControl(''),
      'weatherInterval': new FormControl(''),
      'cameraId': new FormControl(''),
      'modelName': new FormControl(''),
      'modelWidth': new FormControl(''),
      'modelHeight': new FormControl(''),
      'modelMaxResults': new FormControl(''),
      'modelThreshold': new FormControl(''),
      'modelObjectTypeId': new FormControl(''),
      "loggerFreq": new FormControl(''),
      "refreshRules": new FormControl(''),
      "debugOn": new FormControl(''),
      "debugLogs": new FormControl(''),
      'remarks': new FormControl(''),

      'hh': new FormControl(''),
    });

    this.addDevice.get('deviceModeId').valueChanges.subscribe((val: any) => {
      if(val == 3) {
        this.addDevice.get('cameraId').setValidators(Validators.required);
        this.addDevice.get('modelObjectTypeId').setValidators(Validators.required);
      } else {
        this.addDevice.get('cameraId').clearValidators();
        this.addDevice.get('modelObjectTypeId').clearValidators();
      }

      this.addDevice.get('cameraId').updateValueAndValidity();
      this.addDevice.get('modelObjectTypeId').updateValueAndValidity();
    });

    this.getDeviceDetail();
    // this.getCamerasForSiteId();
    // this.toggleCreateWorkingDays();
  }

  cameras: any = [];
  getCamerasForSiteId() {
    this.siteSer.getCamerasForSiteId(this.siteData?.siteid).subscribe((res: any) => {
      this.cameras = res;
    })
  }

  deviceData: any = [];
  deviceLength: any;
  convertedArray: any;
  // deviceMap: any;
  getDeviceDetail() {
    this.assetSer.listDeviceAdsInfo().subscribe((res: any) => {
      this.getMetadata();
      for(let item of res) {
        if(this.siteData.siteid == item.siteId) {
          // let x = item?.adsDevices.forEach((el: any) => el.workingDays);
          // console.log(x);
          // this.convertedArray = JSON.parse(JSON.stringify(x?.split(',').map((item: any) => +item)));

          // const numberStrings = x?.split(',')?.map((str: any) => str.trim());
          // this.convertedArray = numberStrings?.map((str: any) => Number(str));
          // console.log(this.convertedArray)
          this.deviceData = item.adsDevices;
          this.deviceData.forEach((item: any) => {
            item.adsHours.split(',')
          })
          this.deviceLength = this.deviceData.length;
          // console.log(this.deviceData);
        }
      }
    })

    // this.deviceData = this.fromSites;
    // this.deviceLength = this.deviceData.length;
    // console.log(this.deviceData);
  }

  getCurrentDevice(data: any) {
    // console.log('hello')
    this.assetSer.listDeviceByDeviceId(data?.deviceId).subscribe((res: any) => {
      // console.log(res)
    })
  }


  isShown: boolean = false;
  toggleShowOnOff() {
    this.isShown = !this.isShown;
  }

  closeAddDevice() {
    this.newItemEvent.emit();
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


  /* popup */
  @ViewChild('editDeviceDialog') editDevice = {} as TemplateRef<any>;
  currentWorkingDays: any;
  // newdeviceId: any;
  // devDataToEdit: any;
  currentItem: any;
  openEditDevice(item: any) {
    this.currentItem = item;
    // this.currentItem.workingDays = this.currentItem.workingDays.toString().split(',');
    this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
    this.dialog.open(this.editDevice);
  }

  /* dynamic device view */
  // toChild: any
  // onMat(e: any) {
  //   this.toChild = this.deviceData.filter((el: any) => el.deviceId == e.tab.textLabel);
  //   console.log(this.toChild)
  // }

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

    this.adInfo.createdBy = this.user?.UserId;
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
    this.newItemEvent.emit();
    this.assetSer.updateDeviceAdsInfo({adsDevice: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      this.alertSer.success(res?.message ? res?.message : 'Device updated successfully');
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
    // console.log(e.value.length)
  }

  toppings = this.fb.group({
    '00': false,
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

  finalToopings: any;
  myToops: any = [];
  addDeviceDtl() {
    if(this.addDevice.valid) {
      this.newItemEvent.emit();
      
      this.finalToopings =this.toppings.value;
      for(const val in this.finalToopings) {
        if(this.finalToopings[val] === true) {
          this.myToops.push(val)
        }
      }
      this.adInfo.adsHours = this.myToops.join(',');
      this.adInfo.siteId = this.siteData.siteid;
      if(!this.isToogleClicked) {
        let arr: string = this.adInfo.workingDays.join(',');
        let myString = arr.substring(1);
        this.adInfo.workingDays = myString;
      }
      if(this.isToogleClicked) {
        let arr = JSON.parse(JSON.stringify(this.adInfo.workingDays)).join(',');
        if(this.toAddDevice == 8) {
          var myString = arr.substring(1);
          this.adInfo.workingDays = myString;
        } else {
          this.adInfo.workingDays = arr;
        }
      }
      this.alertSer.wait();
      this.adInfo.createdBy = this.user?.UserId;
      this.assetSer.createDeviceandAdsInfo(this.adInfo).subscribe((res: any) => {
        // console.log(res);
        if(res) {
          this.alertSer.success(res?.message ? res?.message : 'Device created successfully');
        }
      }, (err: any) => {
        if(err) {
          this.alertSer.error(err?.error?.message);
        };
      })
    }
    // console.log(this.addDevice);
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
