import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetService } from 'src/services/asset.service';
import { AlertService } from 'src/services/alert.service';
import { SiteService } from 'src/services/site.service';
import { MetadataService } from 'src/services/metadata.service';
import { formatDate } from '@angular/common';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-add-new-asset',
  templateUrl: './add-new-asset.component.html',
  styleUrls: ['./add-new-asset.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddNewAssetComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<any>();

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private assetSer: AssetService,
    private dropDown: MetadataService,
    private alertSer: AlertService,
    private siteService: SiteService,
    private storageSer: StorageService,
    private siteSer: SiteService
  ) { }

  addAssetForm: any = UntypedFormGroup;
  searchText: any;
  currentDate = new Date();

  /* Asset Object */
  siteId: any;
  assetData: any = {
    file: null,
    asset: {
      deviceId: null,
      deviceModeId: null,
      name: null,
      playOrder: 1,
      createdBy: null,
      splRuleId: 0,
      fromDate: null,
      toDate: null
    },
    nameParams: {
      timeId: 3,
      tempId: 4,
      maleKids: 0,
      femaleKids: 0,
      maleYouth: 0,
      femaleYouth: 0,
      maleAdults: 0,
      femaleAdults: 0,
      vehicles: 0,
      persons: 0,

      object: 0,
      person_vehicle:0
    }
  }

  personshow : boolean = false;
  toggleShowOnOff() {
    this.personshow = !this.personshow;
  }


  adFor: any = null;
  enableDemo: boolean = false;

  // deviceIdFromStorage: any;
  user: any;
  ngOnInit(): void {
    this.user = this.storageSer.get('user');
    // this.deviceIdFromStorage = this.storageSer.get('add_body');
    this.addAssetForm = this.fb.group({
      'siteId': new UntypedFormControl('', Validators.required),
      'file': new UntypedFormControl('', Validators.required),
      'deviceId': new UntypedFormControl('', Validators.required),
      'deviceModeId': new UntypedFormControl(''),
      'name': new UntypedFormControl('', Validators.required),
      'playOrder': new UntypedFormControl(''),
      'createdBy': new UntypedFormControl(''),
      'splRuleId': new UntypedFormControl(''),
      'fromDate': new UntypedFormControl(''),
      'toDate': new UntypedFormControl(''),
      'adFor': new UntypedFormControl(''),
      'enableDemo': new UntypedFormControl(''),
      'timeId': new UntypedFormControl(''),
      'tempId': new UntypedFormControl(''),
      'maleKids': new UntypedFormControl(''),
      'femaleKids': new UntypedFormControl(''),
      'maleYouth': new UntypedFormControl(''),
      'femaleYouth': new UntypedFormControl(''),
      'maleAdults': new UntypedFormControl(''),
      'femaleAdults': new UntypedFormControl(''),
      'vehicles': new UntypedFormControl(''),
      'persons': new UntypedFormControl(''),

      'object': new UntypedFormControl(''),
      'person_vehicle': new UntypedFormControl('')
    });

    this.addAssetForm.get('deviceModeId').valueChanges.subscribe((val: any) => {
      if(val == 2 || val == 3) {
        this.addAssetForm.get('timeId').setValidators(Validators.required);
        this.addAssetForm.get('tempId').setValidators(Validators.required);
      } else {
        this.addAssetForm.get('timeId').clearValidators();
        this.addAssetForm.get('tempId').clearValidators();
      }
      this.addAssetForm.get('timeId').updateValueAndValidity();
      this.addAssetForm.get('tempId').updateValueAndValidity();
    });

    this.listSites();
    this.onMetadataChange()
  };

  siteData: any = [];
  listSites() {
    this.siteSer.listSites().subscribe((res: any) => {
      if(res?.Status == 'Success') {
        this.siteData = res.siteList?.sort((a: any, b: any) => a.siteid < b.siteid ? -1 : a.siteid > b.siteid ? 1 : 0);
      }
    });
  }

  filteredDevices: any = [];
  filterAdvertisements() {
    this.assetSer.listDeviceBySiteId({siteId: this.siteId}).subscribe((res: any) => {
      this.filteredDevices = res.flatMap((item: any) => item.adsDevices);
    });
  }

  /* searches */
  siteSearch: any;
  searchSites(event: any) {
    this.siteSearch = (event.target as HTMLInputElement).value
  }

  data: any;
  siteIdList: any;
  deviceIdList: any;
  getRes() {
    this.siteService.listSites().subscribe((res: any) => {
      // console.log(res);
      this.siteIdList = res.sitesList;
    })

    this.assetSer.listDeviceAdsInfo().subscribe((res: any) => {
      const assets = res.flatMap((item: any) => item.adsDevices);
      // console.log(assets);
      this.deviceIdList = assets;
    })
  }

  /* file upload */
  selectedFile: any;
  // selectedFiles: any = [];
  onFileSelected(event: any) {
    if(typeof(event) == 'object') {
      this.selectedFile = event.target.files[0] ?? null;
    }
  }

  deleteFile() {
    this.selectedFile = null;
    this.assetData.file = null;
  }

  closeForm() {
    this.newItemEvent.emit();
  }

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
  adsTime: any;
  onMetadataChange() {
    let data = this.storageSer.get('metaData');
      for(let item of data) {
        if(item.type == 2) {
          this.deviceType = item.metadata;
        }
        else if(item.type == 1) {
          this.deviceMode = item.metadata;
        }
        else if(item.type == 6) {
          this.workingDay = item.metadata;
        }
        else if(item.type == 11) {
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
        else if(item.type == 9) {
          this.adsTime = item.metadata;
        }
      }
  }


  /* Search for Get Site and Device Id's */
  sit: string = '';
  dev: string = '';
  siteSearchh(e: Event) {
    this.sit = (e.target as HTMLInputElement).value;
  }

  deviceSer(e: Event) {
    this.dev = (e.target as HTMLInputElement).value;
  }

  /* create Asset */
  submit: boolean = false;
  addNewAsset() {
    this.submit = true;
    if(this.addAssetForm.valid) {
      if(this.assetData.nameParams.timeId == 3 && this.assetData.nameParams.tempId == 4 && this.assetData.nameParams.object == 0) {
        this.assetData.asset.deviceModeId = 1;
      } else if(this.assetData.nameParams.object == 1) {
        this.assetData.asset.deviceModeId = 3;
      } else {
        this.assetData.asset.deviceModeId = 2;
      }
      this.alertSer.wait();
      this.assetSer.addAsset(this.assetData, this.selectedFile).subscribe((res: any) => {
        this.newItemEvent.emit();
        this.alertSer.success(res?.message);
        }, (err: any) => {
          this.alertSer.error(err?.error?.message);
        });
    }
    // console.log(this.assetData);
  }

}
