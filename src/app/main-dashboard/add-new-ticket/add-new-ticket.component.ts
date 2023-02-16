import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetService } from 'src/services/asset.service';
import { DropDownService } from 'src/services/drop-down.service';
import { FileUploadService } from 'src/services/file-upload.service';

@Component({
  selector: 'app-add-new-ticket',
  templateUrl: './add-new-ticket.component.html',
  styleUrls: ['./add-new-ticket.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)", }), //apply default styles before animation starts
        animate(
          "750ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)", }), //apply default styles before animation starts
        animate(
          "600ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddNewTicketComponent implements OnInit {

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

  constructor(private router: Router, private fb: FormBuilder, private dropDown: DropDownService, private fileUploadService: FileUploadService) { }

  ngOnInit(): void {
    this.addAssetForm = this.fb.group({
      'description': new FormControl(''),
      'siteId': new FormControl(''),
      'deviceId': new FormControl(''),
    });

    // this.ongetDeviceType();
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

  deviceType: Array<any> = [];
  ongetDeviceType() {
    this.dropDown.getDeviceType().subscribe((res: any) => {
      this.deviceType = res;
      // console.log(res)
      // console.log(this.deviceType);
    })
  }

  addNewAsset() {
    // this.assetService.addAsset(formPayload).subscribe((res) => {
    //   console.log(res)
    // })
    console.log(this.addAssetForm.value);
  }

}
