import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeviceService } from 'src/services/device.service';
import { MetadataService } from 'src/services/metadata.service';

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
  ngOnInit() {
    this.addDevice = this.fb.group({
      // 'siteId': new FormControl(''),
      'deviceDescription': new FormControl('', Validators.required),
      'deviceTypeId': new FormControl('', Validators.required),
      'deviceCallFreq': new FormControl('', Validators.required),
      'deviceModeId': new FormControl('', Validators.required),
      'adsHours': new FormControl('', Validators.required),
      'workingDays': new FormControl(''),
      'loggerFreq': new FormControl(''),
      'createdBy': new FormControl(''),
      'softwareVersion': new FormControl(''),
      'socketServer': new FormControl(''),
      'socketPort': new FormControl(''),

      'weatherInterval': new FormControl('', this.adInfo.deviceModeId == 2 ? Validators.required : []),

      'cameraId': new FormControl(''),
      'modelName': new FormControl(''),
      'modelWidth': new FormControl('', this.adInfo.deviceModeId == 2 ? Validators.required : []),
      'modelHeight': new FormControl('', this.adInfo.deviceModeId == 2 ? Validators.required : []),
      'modelMaxResults': new FormControl(''),
      'modelThreshold': new FormControl(''),
      'remarks': new FormControl(''),
      'modelObjectTypeId': new FormControl(''),
    });

    this.getDeviceDetail();
    this.onMetadataChange();
    this.siteData = JSON.parse(localStorage.getItem('device_temp')!);
  }

  adInfo = {
    siteId: null,
    deviceDescription: '',
    deviceTypeId: null,
    deviceCallFreq: 1,
    deviceModeId: null,
    adsHours: '',
    workingDays: '',
    loggerFreq: null,
    createdBy: 1,
    softwareVersion: '1.0.0',
    socketServer: 'staging',
    socketPort: 4324,

    weatherInterval: null, //BSR

    cameraId: '', //ODR
    modelName: '', //ODR
    modelWidth: null, //ODR
    modelHeight: null, //ODR
    modelMaxResults: null, //ODR
    modelThreshold: null, //ODR
    modelObjectTypeId: null //ODR
  }

  // getSiteDetails(){
  //   this.apiser.getUser().subscribe((res:any)=>{
  //     // console.log(res)
  //     if(res.Status == 'Success'){
  //       this.site.userId= "";
  //       this.site.userName= "";
  //       this.site.verticals= res.verticals ;
  //       this.site.customers= res.customers ;
  //       this.site.selectSite= res.selectSite;

  //     }
  //   })
  // }

  deviceData: any;
  getDeviceDetail() {
    this.devService.getDeviceList().subscribe((res: any) => {
      for(let item of res) {
        if(this.siteData.siteId == item.siteId) {
          this.deviceData = item.adsDevices;
          console.log('deviceData', this.deviceData);
        }
      }
      // console.log(this.deviceData[0].deviceDescription);
    })
  }


  isShown: boolean = false; // hidden by default
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

  @ViewChild('myCityDialog') cityDialog = {} as TemplateRef<any>;

  currentItem: any;
  newdeviceId: any;
  // deviceInfo: any;
  devDataToEdit: any
  openDialog(item: any, id: any) {
    this.dialog.open(this.cityDialog);
    this.currentItem = item;

    // let filterDevice = this.deviceData.find((item: any) => {
    //   return item.deviceId == id;
    // })
    // this.deviceInfo = filterDevice;

    this.newdeviceId = id;
    // console.log(this.currentItem);

    for(let item of this.deviceData) {
      // console.log(item);
      if(this.currentItem == item) {
        this.devDataToEdit = item;
      }
    }

    // console.log(this.devDataToEdit);
    console.log(this.currentItem.remarks);
    console.log(this.devDataToEdit.remarks);
  }

  updateDeviceDtl() {


    let originalObject: any = {
      "deviceId": this.newdeviceId,
      "deviceModeId": this.devDataToEdit.deviceModeId,
      "modifiedBy": 1,
      "remarks": this.devDataToEdit.remarks,
      "adsHours": this.devDataToEdit.adsHours,
      "deviceDescription": this.devDataToEdit.deviceDescription
    };

    let updatedObject: any = {
      "deviceId": this.newdeviceId,
      "deviceModeId": this.currentItem.deviceModeId,
      "modifiedBy": 1,
      "remarks": this.currentItem.remarks,
      "adsHours": this.currentItem.adsHours,
      "deviceDescription": this.currentItem.deviceDescription
    };

    let changedKeys: any[] = [];

    for(let key in updatedObject) {
      if (updatedObject.hasOwnProperty(key) && updatedObject[key] != originalObject[key]) {
        changedKeys.push(key);
      }
    }

    console.log(changedKeys);

    this.devService.updateDevice({adsDevice: originalObject, updProps: changedKeys}).subscribe((res: any) => {
      console.log(res);
    })
  }

  confirmEditRow() {
    console.log(this.currentItem);
  }

  /* add device */

  addDeviceDtl() {
    this.adInfo.siteId = this.siteData.siteId;
    if(this.addDevice.valid) {
      this.newItemEvent.emit(false);
      this.devService.addDevice(this.adInfo).subscribe((res: any) => {
        window.location.reload();
        console.log(res);
      })
    }
    console.log('addNewDevice', this.adInfo);
  }


}
