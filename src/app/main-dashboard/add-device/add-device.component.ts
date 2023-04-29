import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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

  constructor(private fb: FormBuilder, private siteService: SiteService, private assetService: AssetService, private dropDown: DropDownService, public dialog: MatDialog) { }

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
    this.ongetDeviceType();
    this.ongetDeviceMode();
    this.onTempRange();
    this.onAgeRange();
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

  updProps = [
    'remarks'
  ]

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
  // addDeviceLength: any;
  getDeviceDetail() {
    this.siteService.getDeviceList().subscribe((res: any) => {
      for(let item of res) {
        if(this.siteData.siteId == item.siteId) {
          this.deviceData = item.adsDevices;
          // console.log(this.deviceData);
        }
      }
      console.log('devices-res', res);
    })
  }


  isShown: boolean = false; // hidden by default
  toggleShowOnOff() {
    this.isShown = !this.isShown;
  }

  closeAddDevice() {
    this.newItemEvent.emit(false);
  }

  /* drop-down methods */

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

  @ViewChild('myCityDialog') cityDialog = {} as TemplateRef<any>;
  currentItem: any;
  openDialog(item: any, i: any) {
    this.dialog.open(this.cityDialog);
    this.currentItem = item;

    // for(let item of this.deviceData) {

    // }

    this.siteService.getDevice("IVISIND1102DV1").subscribe((res:any) => {
      console.log(res);
    })
    console.log(this.deviceData)
  }

  confirmEditRow() {


    console.log("TO BE EDITED:: ", this.currentItem);
  }

  /* add device */

  addDeviceDtl() {
    this.adInfo.siteId = this.siteData.siteId;
    if(this.addDevice.valid) {
      this.newItemEvent.emit(false);
      this.siteService.addDevice(this.adInfo).subscribe((res: any) => {
        window.location.reload();
        console.log(res);
      })
    }
    console.log('addNewDevice', this.adInfo);
  }

  updateDeviceDtl() {}

}
