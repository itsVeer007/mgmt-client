import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetService } from 'src/services/asset.service';
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

  shortLink: string = "";
  file: File | null = null;
  // loading: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private assetService: AssetService, private fileUploadService: FileUploadService) { }

  // user = {
  //   site: "",
  //   device: "",
  //   is_enabled: 1,
  //   mimeType: "",
  //   is_active: 1,
  //   duration: "10",
  //   is_processing: 1,
  //   nocache: 1,
  //   skip_asset_check: 1,
  //   play_order: 0,
  //   assetName: "",
  //   description: "",
  //   url: "",
  //   fromDate: "",
  //   toDate: ""
  // }

  ngOnInit(): void {
    this.addAssetForm = this.fb.group({
      'file': new FormControl(''),
      'siteId': new FormControl(''),
      'deviceId': new FormControl(''),
      'is_enabled': new FormControl(1),
      'mimeType': new FormControl(''),
      // 'is_active': new FormControl(1),
      'duration': new FormControl(''),
      // 'is_processing': new FormControl(1),
      'assetName': new FormControl(''),
      // 'nocache': new FormControl(1),
      // 'skip_asset_check': new FormControl(1),
      'play_order': new FormControl(0),
      'start_date': new FormControl(''),
      'end_date': new FormControl(''),
      'createdBy': new FormControl(''),
      'deviceMode': new FormControl(''),
      'description': new FormControl(''),
    });

    // this.onGetMetadata();
  }

  onChange(event: any) {
    this.file = event.target.files[0];
  }

  onUpload() {
    // this.loading = !this.loading;
    console.log(this.file);

    this.fileUploadService.upload(this.file).subscribe((event: any) => {
      if (typeof(event) === 'object') {
        // this.shortLink = event.link;
        let x= event.name
        console.log(x);
      }
    }
    );
  }

  closeAddCamera(value:boolean) {
    this.newItemEvent.emit(value);
  }

  // openAnotherForm(newform:any) {
  //   // this.newItemEvent.emit(false);
  //   localStorage.setItem('opennewform', newform)
  //   this.closeAddCamera(false);
  // }

  onGetMetadata() {
    this.assetService.getMetadata().subscribe((res) => {
      console.log(res)
    })
  }

  addNewAsset() {
    let formPayload = new FormData();

    formPayload.append('file', this.addAssetForm.get('file').value);
    formPayload.append('siteId', this.addAssetForm.get('siteId').value);
    formPayload.append('deviceId', this.addAssetForm.get('deviceId').value);
    formPayload.append('is_enabled', this.addAssetForm.get('is_enabled').value);
    formPayload.append('mimeType', this.addAssetForm.get('mimeType').value);
    formPayload.append('duration', this.addAssetForm.get('duration').value);
    formPayload.append('assetName', this.addAssetForm.get('assetName').value);
    formPayload.append('play_order', this.addAssetForm.get('play_order').value);
    formPayload.append('start_date', this.addAssetForm.get('start_date').value);
    formPayload.append('end_date', this.addAssetForm.get('end_date').value);
    formPayload.append('createdBy', this.addAssetForm.get('createdBy').value);
    formPayload.append('deviceMode', this.addAssetForm.get('deviceMode').value);
    formPayload.append('description', this.addAssetForm.get('description').value);


    // this.assetService.addAsset(formPayload).subscribe((res) => {
    //   console.log(res)
    // })
    console.log(this.addAssetForm.value);
  }

}
