import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/services/user.service';
import { StorageService } from 'src/services/storage.service';
import { AlertService } from 'src/services/alert.service';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddNewUserComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<any>();

  constructor(
    private router:Router,
    private userSer: UserService,
    private fb: UntypedFormBuilder,
    private http: HttpClient,
    private storageSer: StorageService,
    private alertSer: AlertService
  ) { }


  UserForm: any =  UntypedFormGroup;
  user = {
    firstTimeFlag: "F",
    userName: null,
    firstName: null,
    lastName: null,
    genderFlag: "M",
    realm: null,
    emailId: null,
    contactNumber: null,
    alternateContactNumber: null,
    addressLine1: null,
    addressLine2: null,
    country: null,
    state: null,
    district: null,
    pincode: null,
    city: null,
    createdBy: 1,
    employeeFlag: "F",
    empId: null,
    safetyEscortFlag: "F"
  }

  ngOnInit() {
    this.UserForm = this.fb.group({
      firstTimeFlag: new UntypedFormControl(''),
      userName: new UntypedFormControl('', Validators.required),
      firstName: new UntypedFormControl('', Validators.required),
      lastName: new UntypedFormControl('', Validators.required),
      genderFlag: new UntypedFormControl('', Validators.required),
      realm: new UntypedFormControl('', Validators.required),
      emailId: new UntypedFormControl('', Validators.required),
      contactNumber: new UntypedFormControl('', Validators.required),
      alternateContactNumber: new UntypedFormControl(''),
      addressLine1: new UntypedFormControl(''),
      addressLine2: new UntypedFormControl(''),
      address_2: new UntypedFormControl(''),
      country: new UntypedFormControl('', Validators.required),
      state: new UntypedFormControl('', Validators.required),
      district: new UntypedFormControl('', Validators.required),
      pincode: new UntypedFormControl('', Validators.required),
      city: new UntypedFormControl('', Validators.required),
      employeeFlag: new UntypedFormControl(''),
      empId: new UntypedFormControl(''),
      safetyEscortFlag: new UntypedFormControl('')
    });
    this.getCountry();
  }

  countryList: any;
  getCountry() {
    this.http.get("assets/JSON/countryList.json").subscribe((res: any) => {
      this.countryList = res;
    })
  }

  stateList: any = [];
  filterState(val: any) {
    let x = this.countryList.filter((el: any) => el.countryName == val);
    this.stateList = x.flatMap((el: any) => el.states);
    this.user.state = null;
    this.user.district = null;
  }

  cityList: any
  filterCity(val: any) {
    let x = this.stateList.filter((el: any) => el.stateName == val);
    this.cityList = x.flatMap((el: any) => el.cities);
    this.user.district = null;
  }

  closeAddUser() {
    this.newItemEvent.emit();
  }

  createUser() {
    if(this.UserForm.valid) {
      this.userSer.createUser(this.user).subscribe((res: any) => {
        if(res.status_code == 200) {
          this.newItemEvent.emit();
          this.alertSer.success(res.message);
        }
      }, (err: any) => {
        this.alertSer.error(err.error.message);
      });
    }
    // console.log(this.user);
  }

  // checkbox: boolean = false;
  // onCheck() {
  //   this.checkbox = !this.checkbox;
  // }

}

