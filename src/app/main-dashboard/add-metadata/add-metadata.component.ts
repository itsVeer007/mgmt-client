import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MetadataService } from 'src/services/metadata.service';
import Swal from 'sweetalert2';
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

  constructor(private router: Router, private fb: FormBuilder, private metaDataSer: MetadataService) { }

  metaDataBody = {
    createdBy: 1,
    type: '',
    value: '',
    // remarks: ''
  }

  metaType: any
  ngOnInit(): void {
    this.metadataForm = this.fb.group({
      'createdBy': new FormControl(''),
      'type': new FormControl(''),
      'value': new FormControl('', Validators.required),
      // 'remarks': new FormControl('')
    });

    this.getDeviceType();
    this.metaType = JSON.parse(JSON.stringify(localStorage.getItem('metaType')!));
  }

  closeAddCamera() {
    this.newItemEvent.emit(false);
  }

  type: Array<any> = [];
  getDeviceType() {
    this.metaDataSer.getMetadata().subscribe((res: any) => {
      this.type = res;
      // console.log(res)
    })
  }


  sit: string = '';
  siteSer(e: Event) {
    this.sit = (e.target as HTMLInputElement).value;
  }

  showType = false;
  showValueAndRemark = false;
  openNew(type: any) {
    this.metaDataSer.getMetadata().subscribe((res: any) => {
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


  addData0: any;
  addData1: any;
  addData2: any;
  addMetadata() {
    console.log(this.metaDataBody);

    if(this.metaType == 'Create_New') {
      this.metaDataBody.type =  this.metaDataBody.type;
    } else {
      this.metaDataBody.type = this.metaType;
    }

    if(this.metadataForm.valid) {
      this.newItemEvent.emit(false);
      this.addData2 = Swal.fire({
        text: "Please wait",
        imageUrl: "assets/gif/ajax-loading-gif.gif",
        showConfirmButton: false,
        allowOutsideClick: false
      })

      this.metaDataSer.add(this.metaDataBody).subscribe((res: any) => {
        console.log(res);

        if(res) {
          this.addData1 = Swal.fire({
            icon: 'success',
            title: `Done!`,
            text: 'Data Created Successfully!'
          });
        }

        setTimeout(() => {
          window.location.reload();
        }, 3000);

      }, (err: any) => {
        if(err) {
          this.addData0 = Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: 'Creating Data failed',
          });
        };
      });
    }
  }

}



