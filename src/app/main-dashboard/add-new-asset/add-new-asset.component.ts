import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetService } from 'src/services/asset.service';
import { DropDownService } from 'src/services/drop-down.service';
import { AlertService } from 'src/services/alert.service';

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

  @Input() data: any;
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
  siteIdList: any
  deviceIdList: any
  // loading: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private assetService: AssetService, private dropDown: DropDownService, private alertSer: AlertService) { }


  /* Asset Object */
  asset = {
    file: null,
    siteId: null,
    deviceId: null,
    enabled: 1,
    mimetype: '',
    assetName: '',
    playOrder: 0,
    startDate: '',
    endDate: '',
    createdBy: 1,
    deviceMode: '',
    description: ''
  }

  ngOnInit(): void {
    this.addAssetForm = this.fb.group({
      'file': new FormControl('', Validators.required),
      'siteId': new FormControl('', Validators.required),
      'deviceId': new FormControl('', Validators.required),
      'enabled': new FormControl(''),
      'mimetype': new FormControl('', Validators.required),
      // 'is_active': new FormControl(1),
      // 'duration': new FormControl('9'),
      // 'is_processing': new FormControl(1),
      'assetName': new FormControl('', Validators.required),
      // 'nocache': new FormControl(1),
      // 'skip_asset_check': new FormControl(1),
      'playOrder': new FormControl(''),
      'startDate': new FormControl('', Validators.required),
      'endDate': new FormControl('', Validators.required),
      'createdBy': new FormControl(''),
      'deviceMode': new FormControl('', Validators.required),
      'description': new FormControl(''),
    });

    this.ongetDeviceType();
    this.ongetDeviceMode()
    this.getId();
  };


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
        this.asset.file = null;
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


  /* Metadata API */
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


  /* Add Asset */
  submit: boolean = false;

  addNewAsset() {
    this.submit = true;
    console.log(this.asset);

    if(this.addAssetForm.valid) {
      this.newItemEvent.emit(false);
      this.assetService.addAsset(this.asset, this.selectedFile).subscribe((res: any) => {
        if(res.Status == "Success") {
          this.alertSer.success(res.Message);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          this.alertSer.error(res.Message);
        }
        console.log(res);
      });
    }
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

  getId() {
    this.siteIdList = this.data;
    this.deviceIdList = this.data;
  }

}
