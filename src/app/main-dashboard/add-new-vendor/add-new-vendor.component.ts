import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
export class AddNewVendorComponent implements OnInit {

  constructor(private router: Router, private vendorSer: VendorsService, private apiser: ApiService, private fb: FormBuilder) { }

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


  UserForm: any =  FormGroup;

  vendorBody = {
    name: "",
    proprietorName1: "",
    proprietorName2: "",
    proprietorName3: "",
    emailId1: "",
    emailId2: "",
    emailId3: "",
    mobileNumber1: "",
    mobileNumber2: "",
    mobileNumber3: "",
    status: 1,
    serviceStartDate: "",
    serviceEndDate: "",
    createdBy: 0,
    modifiedBy: 0,
    createdTime: "",
    modifiedTime: "",
    addressLine1: "",
    addressLine2: "",
    state: "",
    postCode: null,
    city: "",
    remarks: ""
  }


  ngOnInit() {
    this.UserForm = this.fb.group({
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

  addInventory0: any;
  addInventory1: any;
  addInventory2: any;
  submit() {
    // console.log(this.x);
    if(this.UserForm.valid) {
      this.newItemEvent.emit(false);

      this.addInventory2 = Swal.fire({
        text: "Please wait",
        imageUrl: "assets/gif/ajax-loading-gif.gif",
        showConfirmButton: false,
        allowOutsideClick: false
      });
      this.vendorSer.createVendors(this.vendorBody).subscribe((res: any) => {
        // console.log(res);

        if(res) {
          this.addInventory1 = Swal.fire({
            icon: 'success',
            title: 'Done!',
            text: `${res.message}`,
          });
        }

        setTimeout(() => {
          window.location.reload();
        }, 3000);

      }, (err: any) => {
        if(err) {
          this.addInventory0 = Swal.fire({
            icon: 'warning',
            title: 'Failed!',
            text: 'Creating Inventory failed',
            // timer: 3000,
          });
        };
      })
    }
  }


  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }

}
