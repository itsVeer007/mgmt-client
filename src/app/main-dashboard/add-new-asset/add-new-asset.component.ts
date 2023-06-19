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

@Component({
  selector: 'app-add-new-asset',
  templateUrl: './add-new-asset.component.html',
  styleUrls: ['./add-new-asset.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }), //apply default styles before animation starts
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
export class AddNewAssetComponent implements OnInit {

  // @Input() data: any;
  @Output() newItemEvent = new EventEmitter<any>();
  // @Output() dataAdded = new EventEmitter<any>();

  // @Output() newUser = new EventEmitter<any>();

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    //   var x = <HTMLElement>document.getElementById(`camera`);
    //   if (x != null) {
      //     if (!x.contains(e.target)) {
        //       this.closeAddCamera(false);
        //     }
        //   }
        // }

  addAssetForm: any = FormGroup;
  searchText: any;
  currentDate = new Date();
  // loading: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private assetService: AssetService,
    private dropDown: MetadataService,
    private alertSer: AlertService,
    private siteService: SiteService,
    private devService: DeviceService
    ) { }


  /* Asset Object */

  assetData = {
    file: null,
    asset: {
      deviceId: '',
      deviceModeId: null,
      name: '',
      playOrder: 1,
      createdBy: 1,
      splRuleId: 0
    },

    nameParams: {
      timeId: 0,
      tempId: 0,
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

      'deviceModeId': new FormControl('', Validators.required),
      'name': new FormControl('', Validators.required),
      'playOrder': new FormControl(''),
      'createdBy': new FormControl(''),
      'splRuleId': new FormControl(''),

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

    this.deviceIdFromStorage = JSON.parse(localStorage.getItem('device_temp')!);

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

      // for(let item of assets) {
      //   this.x = item.siteId;
      // }
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
    this.newItemEvent.emit(false);
  }

  // openAnotherForm(newform:any) {
  //   this.newItemEvent.emit(false);
  //   localStorage.setItem('opennewform', newform);
  //   this.closeAddCamera(false);
  // }


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

  addAsset0: any;
  addAsset1: any;
  addAsset2: any;
  addNewAsset() {
    this.assetData.asset.deviceId = this.deviceIdFromStorage;
    this.newItemEvent.emit(this.deviceIdFromStorage);
    this.submit = true;
    // console.log('assetData', this.assetData);

    if(this.addAssetForm.valid) {
      this.newItemEvent.emit(false);

      this.addAsset0 = Swal.fire({
        text: "Please wait",
        imageUrl: "assets/gif/ajax-loading-gif.gif",
        showConfirmButton: false,
        allowOutsideClick: false
      });


      this.assetService.addAsset(this.assetData, this.selectedFile).subscribe((res: any) => {
        // console.log('addAsset', res);
          if(res) {
            this.addAsset1 = Swal.fire({
              icon: 'success',
              title: 'Done!',
              text: `${res.message}`,
            });
          }

            setTimeout(() => {
              window.location.reload();
            }, 3000);

          }, (err: any) => {
            // console.log(err);
            if(err) {
              this.addAsset0 = Swal.fire({
                icon: 'warning',
                title: 'Failed!',
                text: 'Creating Advertisement failed',
                // timer: 3000,
              });
            };
          });
    }
  }

}
