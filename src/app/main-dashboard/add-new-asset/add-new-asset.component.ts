import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetService } from 'src/services/asset.service';
import { AlertService } from 'src/services/alert.service';
import { SiteService } from 'src/services/site.service';
import { MetadataService } from 'src/services/metadata.service';
import { DeviceService } from 'src/services/device.service';

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
  @Output() newItemEvent = new EventEmitter<boolean>();
  currentDate = new Date();

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
    // siteId: null,
    file: null,
    asset: {
      deviceId: '',
      deviceModeId: null,
      name: '',
      playOrder: 1,
      status: 1,
      createdBy: 1,
      splRuleId: 0
    },

    nameParams: {
      adsTimeId: 1,
      adsTempId: 1,
      adsMaleCount: 1,
      adsFemaleCount: 1,
      adsKidsCount: 1,
      adsYouthCount: 1,
      adsEldersCount: 1
    }

    // mimeType: null,
    // assetName: '',
    // fromDate: '',
    // toDate: '',
    // description: '',
    // enabled: 1,
  }

  ngOnInit(): void {
    this.addAssetForm = this.fb.group({
      'siteId': new FormControl(''),
      'file': new FormControl('', Validators.required),
      'deviceId': new FormControl('', Validators.required),
      'deviceModeId': new FormControl('', Validators.required),
      'playOrder': new FormControl(''),
      'createdBy': new FormControl(''),
      'name': new FormControl(''),

      // 'mimeType': new FormControl(''),
      // 'assetName': new FormControl(''),
      // 'fromDate': new FormControl(''),
      // 'toDate': new FormControl(''),
      // 'description': new FormControl(''),

      // 'enabled': new FormControl(''),
      // 'is_active': new FormControl(1),
      // 'duration': new FormControl('9'),
      // 'is_processing': new FormControl(1),
      // 'nocache': new FormControl(1),
      // 'skip_asset_check': new FormControl(1),
    });

    this.onMetadataChange()
    this.getId();
    this.getRes();
  };

  data: any;
  siteIdList: any;
  deviceIdList: any;
  // x: any;

  getRes() {
    this.siteService.getSites().subscribe((res: any) => {
      // console.log(res);
      this.siteIdList = res.sitesList;
    })


    this.devService.getDeviceList().subscribe((res: any) => {
      const assets = res.flatMap((item: any) => item.adsDevices);
      console.log(assets);

      // for(let item of assets) {
      //   this.x = item.siteId;
      // }
      this.deviceIdList = assets
    })
  }


  /* File Upload Method */

  selectedFile: any;
  selectedFiles:  Array<any> = [];
  onFileSelected(event: any) {
    if(typeof(event) == 'object') {
      this.selectedFile = event.target.files[0] ?? null;
      this.selectedFiles.push(this.selectedFile);
      console.log(this.selectedFile);
    }
  }

  deleteFile(el : any) {
    this.selectedFiles.forEach((value, index) => {
      if(value == el) {
        this.selectedFiles.splice(index, 1);
        this.selectedFile = null;
        this.assetData.file = null;
      }
    })
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
  // workingDay: any;
  // tempRange: any;
  // ageRange: any;
  onMetadataChange() {
    this.dropDown.getMetadata().subscribe((res: any) => {
      for(let item of res) {
        if(item.type == 'Device_Type') {
          this.deviceType = item.metadata;
        }
        else if(item.type == 'Device_Mode') {
          this.deviceMode = item.metadata;
        }
        // else if(item.type == 'Working_Day') {
        //   this.workingDay = item.metadata;
        // }
        // else if(item.type == 'Ads_Temp_Range') {
        //   this.tempRange = item.metadata;
        // }
        // else if(item.type == 'Ads_Age_Range') {
        //   this.ageRange = item.metadata;
        // }
      }
    })
  }


  /* To get Id's of site */

  // siteIdList: any
  // deviceIdList: any
  getId() {
    // this.siteIdList = this.data.reduce((acc: any, current: any) => {
    //   const x = acc.find((item: any) => item.siteId == current.siteId);
    //   if (!x) {
    //     return acc.concat([current]);
    //   } else {
    //     return acc;
    //   }
    // }, []);
    // console.log(this.data)

    // this.deviceIdList = this.data.reduce((acc: any, current: any) => {
    //   const x = acc.find((item: any) => item.siteId == current.siteId);
    //   if (!x) {
    //     return acc.concat([current]);
    //   } else {
    //     return acc;
    //   }
    // }, []);
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
  // x: any
  addNewAsset() {
    this.submit = true;
    console.log('assetData', this.assetData);

    if(this.addAssetForm.valid) {
      this.alertSer.wait('Please wait...');
      this.newItemEvent.emit(false);
      this.assetService.addAsset(this.assetData, this.selectedFile).subscribe((res: any) => {
        if(res.statusCode == 200) {
          this.alertSer.success(res.message);
          this.alertSer.wait('');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }

        console.log('addAsset', res);
      }, (err) => {
        // this.alertSer.error(err.error.message);
        if(err.statusCode == 404) {
          console.log(err.message)
        }
      });
    }
  }


}
