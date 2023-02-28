import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/services/api.service';
import { AssetService } from 'src/services/asset.service';
import { DropDownService } from 'src/services/drop-down.service';
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

  constructor(private fb: FormBuilder, private assetService: AssetService, private dropDown: DropDownService) { }


  device = {
    deviceCallFreq: null,
    deviceMode: '',
    workingDays: '',
    width: null,
    height: null,
    modelName: '',
    resolution: '',
    objectName: '',
    refreshRules: '',
    displayOn: '',
    adsHours: '',
    weather_interval: '',
    cameraId: '',

    //required
    siteId: null,
    deviceTypeId: null,
    deviceName: ''
  }

  siteData: any;
  ngOnInit() {
    this.addDevice = this.fb.group({
      'deviceCallFreq': new FormControl(''),
      'deviceMode': new FormControl(''),
      'workingDays': new FormControl(''),
      'width': new FormControl(''),
      'height': new FormControl(''),
      'modelName': new FormControl(''),
      'resolution': new FormControl(''),
      'objectName': new FormControl(''),
      'refreshRules': new FormControl(null),
      'displayOn': new FormControl(null),
      'adsHours': new FormControl(''),
      'weather_interval': new FormControl(''),
      'cameraId': new FormControl(''),

      //required
      'siteId': new FormControl(null),
      'deviceTypeId': new FormControl(null, Validators.required),
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

  showModel: boolean = false;
  onMode() {
    this.device.deviceMode == "ODR" ? this.showModel = true : this.showModel = false;
  }

  tabs: any[] = [];
  responseData: any;
  add() {
    this.device.siteId = this.siteData.siteId;
    if(this.addDevice.valid) {
      this.assetService.addDevice(this.device).subscribe((res: any) => {
        // this.responseData = res.device-types;
        console.log(res);
        if(res.Status == "Success") {
          this.tabs.push('Device');
        }
        // localStorage.setItem('tab_length', JSON.stringify(this.tabs.length));
      })
    }
    console.log(this.device);
  }

}
