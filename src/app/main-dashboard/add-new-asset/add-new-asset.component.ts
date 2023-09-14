import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetService } from 'src/services/asset.service';
import { AlertService } from 'src/services/alert.service';
import { SiteService } from 'src/services/site.service';
import { MetadataService } from 'src/services/metadata.service';
import { DeviceService } from 'src/services/device.service';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-add-new-asset',
  templateUrl: './add-new-asset.component.html',
  styleUrls: ['./add-new-asset.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }),
        animate(
          "750ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }),
        animate(
          "600ms ease-in-out",
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
    private fb: FormBuilder,
    private assetService: AssetService,
    private dropDown: MetadataService,
    private alertSer: AlertService,
    private siteService: SiteService,
    private devService: DeviceService
  ) { }

    addAssetForm: any = FormGroup;
    searchText: any;
    currentDate = new Date();


  /* Asset Object */

  assetData:any = {
    file: null,
    asset: {
      deviceId: '',
      deviceModeId: null,
      name: '',
      playOrder: 1,
      createdBy: 1,
      splRuleId: 0,
      fromDate: formatDate(this.currentDate, 'yyyy-MM-dd', 'en-us'),
      toDate: '2999-12-31'
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

      persons: 0
    }
  }

  adFor: any = null;
  enableDemo: boolean = false;

  deviceIdFromStorage: any
  ngOnInit(): void {
    this.addAssetForm = this.fb.group({
      'file': new FormControl('', Validators.required),

      'deviceModeId': new FormControl(''),
      'name': new FormControl('', Validators.required),
      'playOrder': new FormControl(''),
      'createdBy': new FormControl(''),
      'splRuleId': new FormControl(''),
      'fromDate': new FormControl(''),
      'toDate': new FormControl(''),

      'adFor': new FormControl(''),
      'enableDemo': new FormControl(''),

      'timeId': new FormControl(''),
      'tempId': new FormControl(''),
      'maleKids': new FormControl(''),
      'femaleKids': new FormControl(''),
      'maleYouth': new FormControl(''),
      'femaleYouth': new FormControl(''),
      'maleAdults': new FormControl(''),
      'femaleAdults': new FormControl(''),
      'vehicles': new FormControl(''),

      'persons': new FormControl('')
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

    this.deviceIdFromStorage = JSON.parse(localStorage.getItem('add_body')!);
    // this.deviceIdFromStorage = JSON.parse(sessionStorage.getItem('user')!);

    this.onMetadataChange()
    this.getRes();
  };

  data: any;
  siteIdList: any;
  deviceIdList: any;
  // x: any;

  getRes() {
    this.siteService.listSites().subscribe((res: any) => {
      // console.log(res);
      this.siteIdList = res.sitesList;
    })


    this.devService.listDeviceAdsInfo().subscribe((res: any) => {
      const assets = res.flatMap((item: any) => item.adsDevices);
      // console.log(assets);
      this.deviceIdList = assets;
    })
  }


  /* File Upload Method */

  selectedFile: any;
  // selectedFiles:  Array<any> = [];
  onFileSelected(event: any) {
    if(typeof(event) == 'object') {
      this.selectedFile = event.target.files[0] ?? null;
      // console.log(this.selectedFile);
    }
  }

  deleteFile() {
    // this.selectedFiles.forEach((value, index) => {
    //   if(value == el) {
    //     this.selectedFiles.splice(index, 1);
    //   }
    // })
    this.selectedFile = null;
    this.assetData.file = null;
  }


  closeForm() {
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
  adsTime: any;
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
        else if(item.type == 'Ads_Time') {
          this.adsTime = item.metadata;
        }
      }
    })
  }


  /* Search for Get Site and Device Id's */

  sit: string = '';
  dev: string = '';
  siteSer(e: Event) {
    this.sit = (e.target as HTMLInputElement).value;
  }

  deviceSer(e: Event) {
    this.dev = (e.target as HTMLInputElement).value;
  }


  /* Add Asset */

  submit: boolean = false;
  // addNewAsset() {
  //   this.submit = true;
  //   if(this.addAssetForm.valid) {
  //     this.assetData.asset.deviceId = this.deviceIdFromStorage;

  //     if(this.assetData.nameParams.timeId == 'All' && this.assetData.nameParams.tempId == 'All') {
  //       this.newItemEvent.emit();
  //       this.alertSer.wait();

  //       this.assetData.asset.deviceModeId = 1;
  //       this.assetData.nameParams.timeId = null;
  //       this.assetData.nameParams.tempId = null;
  //       this.assetService.addAsset(this.assetData, this.selectedFile).subscribe((res: any) => {
  //         console.log(res);
  //         this.alertSer.success( res?.message);
  //         setTimeout(() => {
  //           window.location.reload();
  //         }, 2000);
  //       });
  //     }

  //     else if(this.assetData.nameParams.timeId != 'All' && this.assetData.nameParams.tempId == 'All') {
  //       this.newItemEvent.emit();
  //       this.alertSer.wait();

  //       this.assetData.asset.name = this.assetData.asset.name
  //       this.assetData.asset.deviceModeId = 2;
  //       this.assetData.nameParams.timeId = this.assetData.nameParams.timeId;
  //       this.assetData.nameParams.tempId = 1;
  //       this.assetService.addAsset(this.assetData, this.selectedFile).subscribe((res: any) => {
  //         console.log(res);
  //         if(res) {
  //           this.assetData.asset.name = this.assetData.asset.name + '1';
  //           this.assetData.asset.deviceModeId = 2;
  //           this.assetData.nameParams.timeId = this.assetData.nameParams.timeId;
  //           this.assetData.nameParams.tempId = 2;

  //           this.assetService.addAsset(this.assetData, this.selectedFile).subscribe((res: any) => {
  //             console.log(res);
  //             if(res) {
  //               this.assetData.asset.name = this.assetData.asset.name + '2';
  //               this.assetData.asset.deviceModeId = 2;
  //               this.assetData.nameParams.timeId = this.assetData.nameParams.timeId;
  //               this.assetData.nameParams.tempId = 3;

  //               this.assetService.addAsset(this.assetData, this.selectedFile).subscribe((res: any) => {
  //                 console.log(res);
  //                 this.alertSer.success( res?.message);
  //                 setTimeout(() => {
  //                   window.location.reload();
  //                 }, 2000);
  //               })
  //             }
  //             })
  //           }
  //         });
  //       }

  //       else if(this.assetData.nameParams.tempId != 'All' && this.assetData.nameParams.timeId == 'All') {
  //         this.newItemEvent.emit();
  //         this.alertSer.wait();

  //         this.assetData.asset.name = this.assetData.asset.name
  //         this.assetData.asset.deviceModeId = 2;
  //         this.assetData.nameParams.timeId = 1;
  //         this.assetData.nameParams.tempId = this.assetData.nameParams.tempId;

  //         this.assetService.addAsset(this.assetData, this.selectedFile).subscribe((res: any) => {
  //           console.log(res)
  //           if(res) {
  //             this.assetData.asset.name = this.assetData.asset.name + '1';
  //             this.assetData.asset.deviceModeId = 2;
  //             this.assetData.nameParams.timeId = 2;
  //             this.assetData.nameParams.tempId = this.assetData.nameParams.tempId;

  //             this.assetService.addAsset(this.assetData, this.selectedFile).subscribe((res: any) => {
  //               console.log(res);
  //               this.alertSer.success(res?.message);
  //               setTimeout(() => {
  //                 window.location.reload();
  //               }, 2000);
  //             });
  //           }
  //         });
  //       }

  //       else if(this.assetData.nameParams.timeId != 'All' && this.assetData.nameParams.tempId != 'All') {
  //         this.newItemEvent.emit();
  //         this.alertSer.wait();

  //         this.assetData.asset.deviceModeId = 2;
  //         this.assetData.nameParams.timeId = this.assetData.nameParams.timeId;
  //         this.assetData.nameParams.tempId = this.assetData.nameParams.tempId;

  //         this.assetService.addAsset(this.assetData, this.selectedFile).subscribe((res: any) => {
  //           console.log(res);
  //           this.alertSer.success( res?.message);
  //           setTimeout(() => {
  //             window.location.reload();
  //           }, 2000);
  //         });
  //       }
  //     }
  //     console.log(this.assetData);
  //   }

    addNewAsset() {
      this.submit = true;
      this.assetData.asset.deviceId = this.deviceIdFromStorage?.deviceId;
      if(this.addAssetForm.valid) {
        this.newItemEvent.emit();
        this.alertSer.wait();
        this.assetService.addAsset(this.assetData, this.selectedFile).subscribe((res: any) => {
          this.alertSer.success(res?.message);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          }, (err: any) => {
            if(err) {
              this.alertSer.error(err?.error?.message);
            };
          });
      }
      // console.log(this.assetData);
    }

}
