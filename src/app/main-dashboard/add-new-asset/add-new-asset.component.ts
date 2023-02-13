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

  @Output() newUser = new EventEmitter<any>();

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

  user = {
    customer: "",
    site: "",
    mimeType: "",
    duration: "",
    assetName: "",
    description: "",
    url: "",
    fromDate: "",
    toDate: ""
    // roleList: []
  }

  ngOnInit(): void {
    this.addAssetForm = this.fb.group({
      'customer': new FormControl(''),
      'site': new FormControl(''),
      'mimeType': new FormControl(''),
      'duration': new FormControl(''),
      'assetName': new FormControl(''),
      'description': new FormControl(''),
      'fromDate': new FormControl(''),
      'toDate': new FormControl(''),
      'url': new FormControl(''),
    })
  }

  onChange(event: any) {
    this.file = event.target.files[0];
  }

  onUpload() {
    // this.loading = !this.loading;
    console.log(this.file);

    this.fileUploadService.upload(this.file).subscribe((event: any) => {
      if (typeof (event) === 'object') {
        this.shortLink = event.link;
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

  addNewAsset() {
    console.log(this.addAssetForm.value);

    // this.assetService.addAsset(this.addAssetForm.value).subscribe((res) => {
    //   console.log(res)
    // })
  }

}
