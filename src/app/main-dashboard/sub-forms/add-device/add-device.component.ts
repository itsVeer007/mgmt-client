import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/services/api.service';
import { AssetService } from 'src/services/asset.service';
import { DropDownService } from 'src/services/drop-down.service';

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
  @Input() show:any;
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

  constructor(private fb: FormBuilder, private apiser: ApiService, private dropDown: DropDownService) { }

  ngOnInit(): void {
    this.addDevice = this.fb.group({
      'deviceId': new FormControl(126), //
      'siteId': new FormControl(125), //
      'deviceUnitId': new FormControl(''), //
      'deviceCallFreq': new FormControl(),
      'deviceMode': new FormControl('', Validators.required),
      'workingDays': new FormControl(''),
      'getlogs': new FormControl(), //bol
      'width': new FormControl(),
      'height': new FormControl(),
      'modelName': new FormControl(''), //select
      'resolution': new FormControl(''), //select
      'threshold': new FormControl(''), //
      'maxNo': new FormControl(), //
      'objectName': new FormControl(''), //select
      'refreshRules': new FormControl(), // bol
      'displayOn': new FormControl(), //bol
      'adsHours': new FormControl(''), //?
      'weather_interval': new FormControl(''), //input
      'cameraId': new FormControl(''),
      'createdBy': new FormControl(), //nrq
      'modifiedBy': new FormControl(), //nrq
      'remarks': new FormControl(''), //nrq
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

  deviceType: Array<any> = [];
  ongetDeviceType() {
    this.dropDown.getDeviceType().subscribe((res: any) => {
      this.deviceType = res.List_Shown_By_Type_Given;
    })
  }

  deviceMode: any;
  ongetDeviceMode() {
    this.dropDown.getDeviceMode().subscribe((res: any) => {
      this.deviceMode = res.List_Shown_By_Type_Given;
      // console.log(this.deviceMode)
    })
  }

  tempRange: Array<any> = [];
  onTempRange() {
    this.dropDown.tempRange().subscribe((res: any) => {
      this.tempRange = res.List_Shown_By_Type_Given;
    })
  }

  ageRange: Array<any> = [];
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

    add(){
      console.log("add device", this.addDevice.value);
    }

}
