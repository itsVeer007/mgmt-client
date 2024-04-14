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

  user: any;
  ngOnInit() {
    this.siteData = this.storageSer.get('temp_sites');
    this.user = this.storageSer.get('user');

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

  /* create device */
  toAddDevice: any;
  isToogleClicked: boolean = false;
  onToAddDevice(e: any) {
    this.isToogleClicked = true;
    this.toAddDevice = e.value.length;
    // console.log(e.value.length)
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
