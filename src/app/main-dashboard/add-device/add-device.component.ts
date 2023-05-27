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

      'cameraId': new FormControl('', this.adInfo.deviceModeId == 3 ? Validators.required : []),
      'modelName': new FormControl('', this.adInfo.deviceModeId == 3 ? Validators.required : []),
      'modelWidth': new FormControl('', this.adInfo.deviceModeId == 3 ? Validators.required : []),
      'modelHeight': new FormControl('', this.adInfo.deviceModeId == 3 ? Validators.required : []),
      'modelMaxResults': new FormControl('', this.adInfo.deviceModeId == 3 ? Validators.required : []),
      'modelThreshold': new FormControl('', this.adInfo.deviceModeId == 3 ? Validators.required : []),
      'modelObjectTypeId': new FormControl('', this.adInfo.deviceModeId == 3 ? Validators.required : []),

      "loggerFreq": new FormControl(''),
      "refreshRules": new FormControl(''),
      "debugOn": new FormControl(''),
      "debugLogs": new FormControl(''),
      'remarks': new FormControl(''),
    });

    this.getDeviceDetail();
    this.onMetadataChange();
    this.siteData = JSON.parse(localStorage.getItem('temp_sites')!);
  }

  deviceData: any;
  deviceLength: any;
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
      // console.log('deviceData', this.deviceLength);
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

  currentItem: any;
  newdeviceId: any;
  devDataToEdit: any
  openEditDevice(item: any) {
    this.dialog.open(this.editDevice);
    this.currentItem = item;

    this.newdeviceId = item.deviceId;
    console.log(this.currentItem);
  }

  originalObject: any;

  changedKeys: any[] = [];

  on(event: any) {
    let x = event.source.ngControl.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
      // this.originalObject[x] = Event.target.value;
    }
  }

  onChange(event: any) {
    this.originalObject = {
      "deviceId": this.newdeviceId,
      "deviceModeId": this.currentItem.deviceModeId,
      "deviceCallFreq": this.currentItem.deviceCallFreq,
      "adsHours": this.currentItem.adsHours,
      "workingDays": this.currentItem.workingDays,
      "deviceDescription": this.currentItem.deviceDescription,
      "remarks": this.currentItem.remarks,
      "weatherInterval": this.currentItem.weatherInterval,
      "loggerFreq": this.currentItem.loggerFreq,
      "modelWidth": this.currentItem.modelWidth,
      "modelHeight": this.currentItem.modelHeight,
      "modelName": this.currentItem.modelName,
      "modelObjectTypeId": this.currentItem.modelObjectTypeId,
      "modifiedBy": 1,
    };

    let x = event.target['name'];

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
      // this.originalObject[x] = Event.target.value;
    }
    console.log(this.changedKeys);
    console.log(this.originalObject);
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

    this.devService.updateDeviceAdsInfo({adsDevice: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      console.log(res);
      if(res) {
        this.deviceUpdate1 = Swal.fire({
          icon: 'success',
          title: 'Done!',
          text: 'Asset Updated Successfully!',
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




  confirmEditRow() {
    console.log(this.currentItem);
  }

  tar: any;
  onFocus(e: any) {
    this.tar = e
  }

  /* add device */

  addDevice0: any;
  addDevice1: any;
  addDevice2: any;
  addDeviceDtl() {
    this.adInfo.siteId = this.siteData.siteId;

    // if(this.tar) {
    //   let arr = JSON.parse(JSON.stringify(this.adInfo.workingDays)).join(',');
    //   this.adInfo.workingDays = arr;
    // }

    if(this.addDevice.valid) {
      this.newItemEvent.emit(false);

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
            title: 'Done!',
            text: 'Asset Added Successfully!',
          });
        }

        setTimeout(() => {
          // window.location.reload();
        }, 3000);

      }, (err: any) => {
        console.log(err);
        if(err) {
          this.addDevice0 = Swal.fire({
            icon: 'warning',
            title: 'Failed!',
            text: 'Adding Device failed',
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

  @ViewChild('select') select!: MatSelect;

  allSelected=false;

  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }

  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }

}

