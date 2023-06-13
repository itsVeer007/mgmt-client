import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { DeviceService } from 'src/services/device.service';
import { MetadataService } from 'src/services/metadata.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)", }), //apply default styles before animation starts
        animate(
          "750ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
        animate(
          "600ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})

export class AddDeviceComponent implements OnInit {
  // @Input() data: any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`additionalSite`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       this.closeAddAdditionalSite(false);
  //     }
  //   }
  // }

  addDevice: any =  FormGroup;
  searchText: any;

  constructor(
    private fb: FormBuilder,
    private devService: DeviceService,
    private dropDown: MetadataService,
    public dialog: MatDialog
  ) { }

  siteData: any;

  adInfo = {
    siteId: null,
    deviceDescription: '',
    deviceTypeId: null,
    deviceCallFreq: null,
    deviceModeId: null,
    adsHours: '',
    workingDays: '',
    createdBy: 1,
    softwareVersion: '',
    socketServer: 'ec2-18-213-63-73.compute-1.amazonaws.com',
    socketPort: 6666,
    remarks: '',

    weatherInterval: null, //BSR

    cameraId: '', //ODR
    modelName: '', //ODR
    modelWidth: null, //ODR
    modelHeight: null, //ODR
    modelMaxResults: null, //ODR
    modelThreshold: null, //ODR
    modelObjectTypeId: null, //ODR

    refreshRules: 1,  //ODR
    debugOn: 0,  //ODR
    debugLogs: 1, //ODR
    loggerFreq: 60,  //ODR
  }


  ngOnInit() {
    this.addDevice = this.fb.group({
      'deviceDescription': new FormControl('', Validators.required),
      'deviceTypeId': new FormControl('', Validators.required),
      'deviceCallFreq': new FormControl('', Validators.required),
      'deviceModeId': new FormControl('', Validators.required),
      'adsHours': new FormControl('', Validators.required),
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
    });

    this.getDeviceDetail();
    this.onMetadataChange();
    this.siteData = JSON.parse(localStorage.getItem('temp_sites')!);

    this.addDevice.get('deviceModeId').valueChanges.subscribe((val: any) => {
      if(val == 3) {
        this.addDevice.get('cameraId').setValidators(Validators.required);
        this.addDevice.get('modelName').setValidators(Validators.required);
        this.addDevice.get('modelWidth').setValidators(Validators.required);
        this.addDevice.get('modelHeight').setValidators(Validators.required);
        this.addDevice.get('modelMaxResults').setValidators(Validators.required);
        this.addDevice.get('modelThreshold').setValidators(Validators.required);
        this.addDevice.get('modelObjectTypeId').setValidators(Validators.required);
      } else {
        this.addDevice.get('cameraId').clearValidators();
        this.addDevice.get('modelName').clearValidators();
        this.addDevice.get('modelWidth').clearValidators();
        this.addDevice.get('modelHeight').clearValidators();
        this.addDevice.get('modelMaxResults').clearValidators();
        this.addDevice.get('modelThreshold').clearValidators();
        this.addDevice.get('modelObjectTypeId').clearValidators();
      }

      this.addDevice.get('cameraId').updateValueAndValidity();
      this.addDevice.get('modelName').updateValueAndValidity();
      this.addDevice.get('modelWidth').updateValueAndValidity();
      this.addDevice.get('modelHeight').updateValueAndValidity();
      this.addDevice.get('modelMaxResults').updateValueAndValidity();
      this.addDevice.get('modelThreshold').updateValueAndValidity();
      this.addDevice.get('modelObjectTypeId').updateValueAndValidity();
    })
  }

  deviceData: any;
  deviceLength: any;
  deviceMap: any;
  getDeviceDetail() {
    this.devService.listDeviceAdsInfo().subscribe((res: any) => {
      // console.log(res);
      for(let item of res) {
        if(this.siteData.siteId == item.siteId) {
          this.deviceData = item.adsDevices;

          this.deviceLength = this.deviceData.length;
          // console.log('deviceData', this.deviceData);
        }
      }

    })
  }


  isShown: boolean = false;
  toggleShowOnOff() {
    this.isShown = !this.isShown;
  }

  closeAddDevice() {
    this.newItemEvent.emit(false);
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
    this.dropDown.getMetadata().subscribe((res: any) => {
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


  // selected = new FormControl();
  // addTab() {
  //   this.tabs.push('Device');
  //   this.selected.setValue(this.tabs.length - 1);
  // }

  // removeTab(index: number) {
  //   this.tabs.splice(index, 1);
  // }

  @ViewChild('editDeviceDialog') editDevice = {} as TemplateRef<any>;

  // newdeviceId: any;
  // devDataToEdit: any
  currentItem: any;
  openEditDevice(item: any) {
    this.dialog.open(this.editDevice);
    this.currentItem = item;

    let x = this.currentItem.workingDays.toString().split(',')
    this.currentItem.workingDays = x;

    // this.newdeviceId = item.deviceId;
    console.log(this.currentItem);
  }


  /* dynamic device view */

  // toChild: any
  // onMat(e: any) {
  //   this.toChild = this.deviceData.filter((el: any) => el.deviceId == e.tab.textLabel);
  //   console.log(this.toChild)
  // }

  originalObject: any;
  changedKeys: any[] = [];

  o(event: any) {
    console.log(event);

    this.originalObject = {
      "deviceId": this.currentItem.deviceId,

      "debugOn": this.currentItem.debugOn,
      "debugLogs": this.currentItem.debugLogs,
      "refreshRules": this.currentItem.refreshRules,

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

      "modifiedBy": 1,
    };

    let x = event.source.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }

    console.log(this.changedKeys);
  }

  on(event: any) {
    this.originalObject = {
      "deviceId": this.currentItem.deviceId,

      "deviceModeId": this.currentItem.deviceModeId,
      // "deviceTypeId": this.currentItem.deviceTypeId,
      "adsHours": this.currentItem.adsHours,
      "workingDays": this.currentItem.workingDays,
      "status": this.currentItem.status,
      "modelName": this.currentItem.modelName,
      "modelObjectTypeId": this.currentItem.modelObjectTypeId,

      "deviceCallFreq": this.currentItem.deviceCallFreq,
      "deviceDescription": this.currentItem.deviceDescription,
      "remarks": this.currentItem.remarks,
      "weatherInterval": this.currentItem.weatherInterval,
      "loggerFreq": this.currentItem.loggerFreq,
      "modelWidth": this.currentItem.modelWidth,
      "modelHeight": this.currentItem.modelHeight,

      "debugOn": this.currentItem.debugOn,
      "debugLogs": this.currentItem.debugLogs,
      "refreshRules": this.currentItem.refreshRules,

      "modifiedBy": 1,
    };

    let x = event.source.ngControl.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }

    console.log(this.changedKeys);
    // console.log(this.originalObject);
  }

  onChange(event: any) {
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

    let x = event.target['name'];

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
      // this.originalObject[x] = Event.target.value;
    }
    console.log(this.changedKeys);
  }

  deviceUpdate0: any;
  deviceUpdate1: any;
  deviceUpdate2: any;
  updateDeviceDtl() {
    this.deviceUpdate2 = Swal.fire({
      text: "Please wait",
      imageUrl: "assets/gif/ajax-loading-gif.gif",
      showConfirmButton: false,
      allowOutsideClick: false
    });

    let arr = this.currentItem.workingDays.join(',');

    if(this.toAddDevice == 8) {
      var myString = arr.substring(1);
      this.originalObject.workingDays = myString;
    } else {
      this.originalObject.workingDays = arr;
    }

    this.newItemEvent.emit(false);
    this.devService.updateDeviceAdsInfo({adsDevice: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      console.log(res);

      if(res) {
        this.deviceUpdate1 = Swal.fire({
          icon: 'success',
          title: 'Done!',
          text: 'Device Updated Successfully!',
      });
      }

      setTimeout(() => {
        // window.location.reload();
      }, 3000);

    }, (err: any) => {
      if(err) {
        this.deviceUpdate0 = Swal.fire({
          icon: 'warning',
          title: 'Failed!',
          text: 'Updating Device failed',
          // timer: 3000,
        });
      };
    })
  }


  /* add device */

  toAddDevice: any;
  onToAddDevice(e: any) {
    this.toAddDevice = e.value.length;
    // console.log(e.value.length)
  }

  addDevice0: any;
  addDevice1: any;
  addDevice2: any;
  addDeviceDtl() {
    this.adInfo.siteId = this.siteData.siteId;

    if(this.addDevice.valid) {
      this.newItemEvent.emit(false);

      let arr = JSON.parse(JSON.stringify(this.adInfo.workingDays)).join(',');
      if(this.toAddDevice == 8) {
        var myString = arr.substring(1);
        this.adInfo.workingDays = myString;
      } else {
        this.adInfo.workingDays = arr;
      }

      this.addDevice2 = Swal.fire({
        text: "Please wait",
        imageUrl: "assets/gif/ajax-loading-gif.gif",
        showConfirmButton: false,
        allowOutsideClick: false
      })

      this.devService.createDeviceandAdsInfo(this.adInfo).subscribe((res: any) => {
        console.log(res);

        if(res) {
          this.addDevice1 = Swal.fire({
            icon: 'success',
            title: `Device Id: ${res.deviceId}`,
            text: 'Device Created Successfully!'
          });
        }

        setTimeout(() => {
          // window.location.reload();
        }, 3000);

      }, (err: any) => {
        console.log(err);
        if(err) {
          this.addDevice0 = Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: 'Creating Device failed',
            // timer: 3000,
          });
        };
      })
    }
    console.log('addNewDevice', this.adInfo);
  }

  // showAdsHours: boolean = false;
  // showAdsHoursTxt: any = '...more'
  // showAd() {
  //   this.showAdsHours = !this.showAdsHours;

  //   if(this.showAdsHours == false) {
  //     this.showAdsHoursTxt = '...more';
  //   } else {
  //     this.showAdsHoursTxt = '...less'
  //   }
  // }


  @ViewChild('mySel') mySel!: MatSelect;

  @ViewChild('mySell') mySell!: MatSelect;

  allSelected = false;
  toggleAllSelection() {
    this.allSelected = !this.allSelected;

    if (this.allSelected) {
      this.mySel.options.forEach( (item : MatOption) => item.select());
    } else {
      this.mySel.options.forEach( (item : MatOption) => {item.deselect()});
    }

    if (this.allSelected) {
      this.mySell.options.forEach( (item : MatOption) => item.select());
    } else {
      this.mySell.options.forEach( (item : MatOption) => {item.deselect()});
    }
  }

}

