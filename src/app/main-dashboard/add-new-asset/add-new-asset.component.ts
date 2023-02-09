import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetService } from 'src/app/utilities/asset.service';

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

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`camera`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       this.closeAddCamera(false);
  //     }
  //   }
  // }

  addAssetForm: any = FormGroup;

  constructor(private router: Router, private fb: FormBuilder, assetService: AssetService) { }

  ngOnInit(): void {
    this.addAssetForm = this.fb.group({
      'customer': new FormControl(''),
      'site': new FormControl(''),
      'mimeType': new FormControl(''),
      'duration': new FormControl(''),
      'assetName': new FormControl(''),
      'description': new FormControl(''),
      'url': new FormControl(''),
    })
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
    console.log(this.addAssetForm.value)
  }

}
