import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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

  ngOnInit(): void {
    this.addAssetForm = this.fb.group({
      'file': new FormControl(''),
      'siteId': new FormControl(),
      'deviceId': new FormControl(),
      'enabled': new FormControl(1),
      'mimetype': new FormControl(''),
      // 'is_active': new FormControl(1),
      // 'duration': new FormControl('9'),
      // 'is_processing': new FormControl(1),
      'asset_name': new FormControl(''),
      // 'nocache': new FormControl(1),
      // 'skip_asset_check': new FormControl(1),
      'play_order': new FormControl(0),
      'start_date': new FormControl(''),
      'end_date': new FormControl(''),
      'createdBy': new FormControl(1),
      'deviceMode': new FormControl(''),
      'description': new FormControl(''),
    });

    this.ongetDeviceType();
    this.ongetDeviceMode()
  };

  siteIdList = [ 3001, 3002, 3003, 3004];

  deviceIdList = [ 301, 302, 303, 304];

  selectedFile: any = null;

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }

  closeAddCamera(value:boolean) {
    this.newItemEvent.emit(value);
  }

  // onChange(event: any) {
  //   this.file = event.target.files[0];
  // }

  // onUpload() {
  //   this.loading = !this.loading;
  //   console.log(this.file);

  //   this.fileUploadService.upload(this.file).subscribe((event: any) => {
  //     if (typeof(event) === 'object') {
  //       this.shortLink = event.link;
  //       let x= event.name
  //       console.log(x);
  //     }
  //   }
  //   );
  // }

  // openAnotherForm(newform:any) {
  //   // this.newItemEvent.emit(false);
  //   localStorage.setItem('opennewform', newform)
  //   this.closeAddCamera(false);
  // }

  deviceType: Array<any> = [];
  ongetDeviceType() {
    this.dropDown.getDeviceType().subscribe((res: any) => {
      this.deviceType = res.List_Shown_By_Type_Given;
    })
  }

  deviceMode: Array<any> = [];
  ongetDeviceMode() {
    this.dropDown.getDeviceMode().subscribe((res: any) => {
      this.deviceMode = res.List_Shown_By_Type_Given;
    })
  }


  addNewAsset() {
    this.assetService.addAsset(this.addAssetForm.value, this.selectedFile).subscribe((res) => {
      console.log(res)
    });

    console.log(this.addAssetForm.value);
  }


}
