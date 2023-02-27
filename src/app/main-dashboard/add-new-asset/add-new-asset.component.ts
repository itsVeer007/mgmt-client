import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetService } from 'src/services/asset.service';
import { DropDownService } from 'src/services/drop-down.service';
import { FileUploadService } from 'src/services/file-upload.service';

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

  @Input() show:any;
  @Output() newItemEvent = new EventEmitter<boolean>();

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

  // shortLink: string = "";
  // file: File | null = null;
  // loading: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private assetService: AssetService, private dropDown: DropDownService) { }

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
      'siteId': new FormControl(null, Validators.required),
      'deviceId': new FormControl('', Validators.required),
      'enabled': new FormControl(1),
      'mimetype': new FormControl('', Validators.required),
      // 'is_active': new FormControl(1),
      // 'duration': new FormControl('9'),
      // 'is_processing': new FormControl(1),
      'assetName': new FormControl('', Validators.required),
      // 'nocache': new FormControl(1),
      // 'skip_asset_check': new FormControl(1),
      'playOrder': new FormControl(0),
      'startDate': new FormControl('', Validators.required),
      'endDate': new FormControl('', Validators.required),
      'createdBy': new FormControl(1),
      'deviceMode': new FormControl('', Validators.required),
      'description': new FormControl(''),
    });

    this.ongetDeviceType();
    this.ongetDeviceMode()
  };

  siteIdList = [ 1077, 1002, 3002, 9999];

  deviceIdList = [ 1054, 1035, 1022, 390];

  selectedFile: any = null;
  selectedFiles:  Array<any> = [];

  onFileSelected(event: any) {
    if(typeof(event) == 'object') {
      this.selectedFile = event.target.files[0] ?? null;
      this.selectedFiles.push(this.selectedFile);
    }
  }

  deleteFile() {
    this.selectedFiles.pop();
  }

  closeAddCamera() {
    this.newItemEvent.emit(false);
  }

  // openAnotherForm(newform:any) {
  //   // this.newItemEvent.emit(false);
  //   localStorage.setItem('opennewform', newform)
  //   this.closeAddCamera(false);
  // }

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


  submit: boolean = false;
  addNewAsset() {
    if(this.addAssetForm.valid) {
      this.assetService.addAsset(this.addAssetForm.value, this.selectedFile).subscribe((res) => {
        console.log(res)
      });

    }
    this.submit = true;
    console.log(this.addAssetForm.value);
  }

}
