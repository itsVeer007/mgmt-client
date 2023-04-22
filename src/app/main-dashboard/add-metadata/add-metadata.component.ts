import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DropDownService } from 'src/services/drop-down.service';

@Component({
  selector: 'app-add-metadata',
  templateUrl: './add-metadata.component.html',
  styleUrls: ['./add-metadata.component.css'],
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
export class AddMetadataComponent implements OnInit {

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

  constructor(private router: Router, private fb: FormBuilder, private dropDown: DropDownService) { }

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

  closeAddCamera() {
    this.newItemEvent.emit(false);
  }

  // openAnotherForm(newform:any) {
  //   // this.newItemEvent.emit(false);
  //   localStorage.setItem('opennewform', newform)
  //   this.closeAddCamera(false);
  // }

  deviceType: Array<any> = [];
  ongetDeviceType() {
    // this.dropDown.getDeviceType({type: "Device_Mode"}).subscribe((res: any) => {
    //   this.deviceType = res;
    //   console.log(res)
    // })
  }

  addNewAsset() {
    // this.assetService.addAsset(formPayload).subscribe((res) => {
    //   console.log(res)
    // })
    console.log(this.addAssetForm.value);
  }

}
