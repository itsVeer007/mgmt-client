import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AssetService } from 'src/services/asset.service';
import { DropDownService } from 'src/services/drop-down.service';
import { SiteService } from 'src/services/site.service';

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

  items = ['john', 'mark', 'cooper', 'henry', 'roben'];

  constructor(private fb: FormBuilder, private siteService: SiteService, private assetService: AssetService, private dropDown: DropDownService) { }

  // asset = {
  //   siteId: null,
  //   deviceDescription: '',
  //   deviceTypeId: null,
  //   deviceId: null,
  //   deviceUnitId: '',
  //   deviceCallFreq: 1,
  //   deviceMode: null, //change to number
  //   workingDays: '',
  //   getlogs: 0,
  //   width: null,
  //   height: null,
  //   modelName: '',
  //   resolution: '',
  //   threshold: '',
  //   maxNo: 3,
  //   objectName: '',
  //   refreshRules: null,
  //   displayOn: null,
  //   adsHours: '',
  //   weather_interval: '',
  //   cameraId: '',
  //   createdBy: 1,
  //   remarks: ''
  // }


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
    softwareVersion: '',
    socketServer: '',
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

  siteData: any;
  ngOnInit() {
    this.addDevice = this.fb.group({
      // 'siteId': new FormControl(''),
      'deviceDescription': new FormControl(''),
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

    this.ongetDeviceType();
    this.ongetDeviceMode();
    this.onTempRange();
    this.onAgeRange();
    this.siteData = JSON.parse(localStorage.getItem('device_temp')!);
    // localStorage.setItem('tab_length', this.addDeviceLength);
    // console.log(this.addDeviceLength)
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

  deviceData: any
  addDeviceLength: any;
  getDeviceDetail() {
    this.siteService.getDevice().subscribe((res: any) => {
      for(let item of res) {
        this.addDeviceLength = item.adsDevices.length;
        if(this.siteData.siteId == item.siteId) {
          this.deviceData = item.adsDevices;
        }
        // console.log(item)
      }
      // console.log(res)
    })
  }

  isShown: boolean = false; // hidden by default

  toggleShowOnOff() {
    this.isShown = !this.isShown;
  }

  closeAddAdditionalSite() {
    this.newItemEvent.emit(false);
  }

  // deviceTypeIdList = [1, 2, 3, 4, 5];


  // drop-down-service-methods
  deviceType: any;
  ongetDeviceType() {
    this.dropDown.getMetadata().subscribe((res: any) => {
      for(let item of res) {
        if(item.type == 'Device_Type') {
          this.deviceType = item.metadata;
        }
      }
    })
  }

  deviceMode: any;
  ongetDeviceMode() {
    this.dropDown.getDeviceMode().subscribe((res: any) => {
      for(let item of res) {
        if(item.type == 'Device_Mode') {
          this.deviceMode = item.metadata;
        }
      }
    })
  }

  // deviceModeId: any;
  // forDeviceMode() {
  //   let x = this.deviceMode
  //   for(let item of x) {
  //     this.deviceModeId = item.id;
  //     console.log(this.deviceModeId)
  //   }
  // }

  tempRange: any;
  onTempRange() {
    // this.dropDown.tempRange().subscribe((res: any) => {
    //   this.tempRange = res.List_Shown_By_Type_Given;
    // })
  }

  ageRange: any;
  onAgeRange() {
    // this.dropDown.ageRange().subscribe((res: any) => {
    //   this.ageRange = res.List_Shown_By_Type_Given;
    // })
  }


  // selected = new FormControl();
  // addTab() {
  //   this.tabs.push('Device');
  //   this.selected.setValue(this.tabs.length - 1);
  // }

  // removeTab(index: number) {
  //   this.tabs.splice(index, 1);
  // }


  // tabs: any[] = [];
  responseData: any;
  addNewDevice() {
    this.adInfo.siteId = this.siteData.siteId;
    if(this.addDevice.valid) {
      this.newItemEvent.emit(false);
      this.siteService.addDevice(this.adInfo).subscribe((res: any) => {
        window.location.reload();
        console.log(res);
        // localStorage.setItem('tab_length', JSON.stringify(this.tabs.length));
      })
    }
    console.log(this.adInfo);
  }

}
