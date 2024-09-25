import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
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
    private fb: FormBuilder,
    private http: HttpClient,
    private storageSer: StorageService,
    private alertSer: AlertService
  ) { }


  UserForm!: FormGroup;
  ngOnInit() {
    this.UserForm = this.fb.group({
      firstTimeFlag: new FormControl('F'),
      userName: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      genderFlag: new FormControl('M', Validators.required),
      realm: new FormControl('', Validators.required),
      emailId: new FormControl('', Validators.required),
      contactNumber: new FormControl('', Validators.required),
      alternateContactNumber: new FormControl(''),
      addressLine1: new FormControl(''),
      addressLine2: new FormControl(''),
      address_2: new FormControl(''),
      country: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      pincode: new FormControl(0, Validators.required),
      city: new FormControl('', Validators.required),
      employeeFlag: new FormControl('F'),
      empId: new FormControl(''),
      safetyEscortFlag: new FormControl('F')
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
    this.UserForm.value.state = '';
    this.UserForm.value.district = '';
  }

  cityList: any
  filterCity(val: any) {
    let x = this.stateList.filter((el: any) => el.stateName == val);
    this.cityList = x.flatMap((el: any) => el.cities);
    this.UserForm.value.district = '';
  }

  closeAddUser() {
    this.newItemEvent.emit();
  }



  createUser() {
    if(this.UserForm.valid) {
      this.userSer.createUser(this.UserForm.value).subscribe((res: any) => {
        if(res.statusCode == 200) {
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

