import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/services/api.service';
import { AssetService } from 'src/services/asset.service';
import { DropDownService } from 'src/services/drop-down.service';
import { SiteService } from 'src/services/site.service';
import { AddDevice } from './add-device';

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


  device = {
    siteId: null,
    deviceTypeId: null,
    deviceName: ''
  }

  asset = {
    deviceId: null,
    siteId: null,
    deviceUnitId: '',
    deviceCallFreq: null,
    deviceMode: '',
    workingDays: '',
    getlogs: 0,
    width: null,
    height: null,
    modelName: '',
    resolution: '',
    threshold: "",
    maxNo: 3,
    objectName: '',
    refreshRules: null,
    displayOn: null,
    adsHours: '',
    weather_interval: '',
    cameraId: '',
    createdBy: 1,
    remarks: ""
  }

  siteData: any;
  ngOnInit() {
    this.addDevice = this.fb.group({
      // 'deviceId': new FormControl(''),
      // 'siteId': new FormControl(''),
      'deviceUnitId': new FormControl(''),
      'deviceCallFreq': new FormControl(''), //default -1
      'deviceMode': new FormControl(''), //default -bs
      'workingDays': new FormControl(''), //default -all
      'getlogs': new FormControl(''),
      'width': new FormControl(''),
      'height': new FormControl(''),
      'modelName': new FormControl(''),
      'resolution': new FormControl(''),
      'threshold': new FormControl(''),
      'maxNo': new FormControl(''),
      'objectName': new FormControl(''), //default -person
      'refreshRules': new FormControl(''), //default -false
      'displayOn': new FormControl(''), //default -false
      'adsHours': new FormControl(''), //default -9am - 6pm
      'weather_interval': new FormControl(''), //default -15min
      'cameraId': new FormControl(''),
      'createdBy': new FormControl(''),
      'remarks': new FormControl(''),

      //required
      // 'siteId': new FormControl(''),
      'deviceTypeId': new FormControl(''),
      'deviceName': new FormControl(''),
    });

    this.ongetDeviceType();
    this.ongetDeviceMode();
    this.onTempRange();
    this.onAgeRange();
    this.siteData = JSON.parse(localStorage.getItem('device_temp')!);
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

  isShown: boolean = false; // hidden by default

  toggleShowOnOff() {
    this.isShown = !this.isShown;
  }

  closeAddAdditionalSite() {
    this.newItemEvent.emit(false);
  }

  deviceTypeIdList = [1, 2, 3, 4, 5];

  // drop-down-service-methods //
  deviceType: any;
  ongetDeviceType() {
    this.dropDown.getDeviceType().subscribe((res: any) => {
      this.deviceType = res.List_Shown_By_Type_Given;
    })
  }

  deviceMode: any;
  ongetDeviceMode() {
    this.dropDown.getDeviceMode().subscribe((res: any) => {
      this.deviceMode = res.List_Shown_By_Type_Given;
    })
  }

  tempRange: any;
  onTempRange() {
    this.dropDown.tempRange().subscribe((res: any) => {
      this.tempRange = res.List_Shown_By_Type_Given;
    })
  }

  ageRange: any;
  onAgeRange() {
    this.dropDown.ageRange().subscribe((res: any) => {
      this.ageRange = res.List_Shown_By_Type_Given;
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

  tabs: any[] = [];
  responseData: any;
  add() {
    this.device.siteId = this.siteData.siteId;
    if(this.addDevice.valid) {
      this.siteService.addDevice(this.device).subscribe((res: any) => {
        // this.responseData = res.device-types;
        console.log(res);
        if(res.Status == "Success") {
          this.tabs.push('Device');

          this.asset.deviceId = res.deviceUnitId;
          this.asset.siteId = res.siteId;
          this.assetService.createDeviceAdd(this.asset).subscribe((data: any) => {
            console.log(data);
          })
        }
        // localStorage.setItem('tab_length', JSON.stringify(this.tabs.length));
      })
    }
    console.log(this.device);
    console.log(this.asset);
  }

}
