import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DropDownService } from 'src/services/drop-down.service';
import swal from 'sweetalert2';
// import * as swal from 'sweetalert2';

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

  @Input() metadataDetail: any;
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

  metadataForm: any = FormGroup;
  ng: any;

  constructor(private router: Router, private fb: FormBuilder, private dropDown: DropDownService) { }

  metaDataBody = {
    createdBy: 1,
    type: '',
    value: '',
    remarks: ''

  }

  ngOnInit(): void {
    this.metadataForm = this.fb.group({
      'createdBy': new FormControl(''),
      'type': new FormControl('', this.ng == 'Create New' ? Validators.required : []),
      'value': new FormControl('', Validators.required),
      'remarks': new FormControl(''),
      'ng': new FormControl(''),
    });

    this.getDeviceType();
  }

  closeAddCamera() {
    this.newItemEvent.emit(false);
  }

  type: Array<any> = [];
  getDeviceType() {
    this.dropDown.getMetadata().subscribe((res: any) => {
      this.type = res;
      console.log(res)
    })
  }


  sit: string = '';
  siteSer(e: Event) {
    this.sit = (e.target as HTMLInputElement).value;
  }

  showType = false;
  showValueAndRemark = false;
  openNew(type: any) {
    this.dropDown.getMetadata().subscribe((res: any) => {
      for(let item of res) {
        if(type == '') {
          this.showType = true
        } else {
          this.showType = false
        }

        if(type == item.type) {
          this.showValueAndRemark = true
        }
      }
    })
  }

  newList: any[] = [];
  addtoList() {
    this.newList.push(this.metaDataBody)
  }


  addNewAsset() {
    if(this.metadataForm.valid) {
      this.dropDown.add(this.metaDataBody).subscribe((res) => {
        console.log(res)
      })
    }
    console.log(this.metaDataBody);
  }

}



  //   swal.fire({
  //     title: 'Your Title',
  //     text: "You won't be able to revert this!",
  //     input: 'textarea',
  //     inputAttributes: {
  //         autocapitalize: 'off'
  //     },
  //     showCancelButton: true,
  //     confirmButtonText: 'ok',
  //     cancelButtonText: 'cancel',
  //     allowOutsideClick: false
  //   }).then((result: any) => {
  //     if (result.dismiss !== 'cancel') {
  //       swal.fire({
  //         title: 'Deleted',
  //       })
  //     }
  // })


