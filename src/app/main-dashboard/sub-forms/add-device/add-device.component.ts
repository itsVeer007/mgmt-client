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
  @Input() data: any;
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


  device: AddDevice = {
    deviceId: 126,
    siteId: 125,
    deviceUnitId: '',
    deviceCallFreq: null,
    deviceMode: '',
    workingDays: '',
    getlogs: 0,
    width: null,
    height: null,
    modelName: '',
    resolution: '',
    threshold: '',
    maxNo: 3,
    objectName: '',
    refreshRules: '',
    displayOn: '',
    adsHours: '',
    weather_interval: '',
    cameraId: '',
    createdBy: 1,
    modifiedBy: 0,
    remarks: ''
  }

  ngOnInit(): void {
    this.addDevice = this.fb.group({
      'deviceId': new FormControl(null),
      'siteId': new FormControl(null),
      'deviceUnitId': new FormControl(''),
      'deviceCallFreq': new FormControl('', Validators.required),
      'deviceMode': new FormControl('', Validators.required),
      'workingDays': new FormControl('', Validators.required),
      'getlogs': new FormControl(null),
      'width': new FormControl('', Validators.required),
      'height': new FormControl('', Validators.required),
      'modelName': new FormControl('', this.device.deviceMode == 'BSR' ? Validators.required : []),
      'resolution': new FormControl('', this.device.deviceMode == 'BSR' ? Validators.required : []),
      'threshold': new FormControl(''), //
      'maxNo': new FormControl(null), //
      'objectName': new FormControl('', this.device.deviceMode == 'BSR' ? Validators.required : []),
      'refreshRules': new FormControl(null),
      'displayOn': new FormControl(null),
      'adsHours': new FormControl([''], Validators.required),
      'weather_interval': new FormControl('', this.device.deviceMode == 'BSR' ? Validators.required : []),
      'cameraId': new FormControl('', Validators.required),
      'createdBy': new FormControl(null),
      'modifiedBy': new FormControl(null),
      'remarks': new FormControl(''),
    });

    this.ongetDeviceType();
    this.ongetDeviceMode();
    this.onTempRange();
    this.onAgeRange();
    // this.getSiteDetails()
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

  closeAddAdditionalSite(value: boolean) {
    this.newItemEvent.emit(value);
  }

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

  tabs = ['Device'];
  selected = new FormControl();
  addTab() {
    this.tabs.push('Device');
    this.selected.setValue(this.tabs.length - 1);
  }

  // removeTab(index: number) {
  //   this.tabs.splice(index, 1);
  // }

  showModel: boolean = false;
  onMode() {
    this.device.deviceMode == "BSR" ? this.showModel = true : this.showModel = false;
  }

  add() {
    if(this.addDevice.valid) {
      this.assetService.addDevice(this.device).subscribe((res) => {
        console.log(res)
      })
    }
    console.log(this.device);
  }

}
