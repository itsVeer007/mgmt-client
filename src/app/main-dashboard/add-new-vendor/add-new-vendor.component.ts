import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { ApiService } from 'src/services/api.service';
import { VendorsService } from 'src/services/vendors.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-new-vendor',
  templateUrl: './add-new-vendor.component.html',
  styleUrls: ['./add-new-vendor.component.css'],
    animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }),
        animate(
          "750ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }),
        animate(
          "600ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddNewVendorComponent implements OnInit {

  constructor(
    private router: Router,
    private vendorSer: VendorsService,
    private apiser: ApiService,
    private fb: FormBuilder,
    public alertSer: AlertService
  ) { }

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<boolean>();

  @Output() newUser = new EventEmitter<any>();

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`user`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       this.closeAddUser(false);
  //     }
  //   }
  // }


  vendorForm: any =  FormGroup;

  vendorBody = {
    name: null,
    proprietorName1: null,
    proprietorName2: null,
    proprietorName3: null,
    emailId1: null,
    emailId2: null,
    emailId3: null,
    mobileNumber1: null,
    mobileNumber2: null,
    mobileNumber3: null,
    status: 1,
    serviceStartDate: null,
    serviceEndDate: null,
    createdBy: 0,
    createdTime: null,
    modifiedTime: null,
    addressLine1: null,
    addressLine2: null,
    country: null,
    state: null,
    postCode: null,
    city: null,
    remarks: null
  }


  ngOnInit() {
    this.vendorForm = this.fb.group({
      'name': new FormControl('', Validators.required),
      'proprietorName1': new FormControl('', Validators.required),
      'proprietorName2': new FormControl(''),
      'proprietorName3': new FormControl(''),
      'emailId1': new FormControl('', Validators.required),
      'emailId2': new FormControl(''),
      'emailId3': new FormControl(''),
      'mobileNumber1': new FormControl('', Validators.required),
      'mobileNumber2': new FormControl(''),
      'mobileNumber3': new FormControl(''),
      'status': new FormControl(''),
      'serviceStartDate': new FormControl(''),
      'serviceEndDate': new FormControl(''),
      'createdBy': new FormControl(''),
      'modifiedBy': new FormControl(''),
      'createdTime': new FormControl(''),
      'modifiedTime': new FormControl(''),
      'addressLine1': new FormControl('', Validators.required),
      'addressLine2': new FormControl(''),
      'postCode': new FormControl('', Validators.required),
      'country': new FormControl('', Validators.required),
      'state': new FormControl('', Validators.required),
      'city': new FormControl('', Validators.required),
      'remarks': new FormControl('')
    });
  }

  closeAddUser() {
    this.newItemEvent.emit(false);
  }

  openAnotherForm(newform:any) {
    this.newItemEvent.emit(false);
    localStorage.setItem('opennewform', newform)
  }

  submitted!: boolean;
  submit() {
    console.log(this.vendorBody)
    if(this.vendorForm.valid) {
      this.newItemEvent.emit(false);
      this.alertSer.wait();
      this.vendorSer.createVendors(this.vendorBody).subscribe((res: any) => {
        // console.log(res);
        if(res) {
          this.alertSer.success(res);
        }
        setTimeout(() => {
          // window.location.reload();
        }, 3000);

      }, (err: any) => {
        if(err) {
          this.alertSer.error();
        };
      })
    }
  }


  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }

}
