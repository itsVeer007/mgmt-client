import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  @Output() newItemEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private userSer: UserService,
    private fb: FormBuilder,
    private http: HttpClient,
    private storageSer: StorageService,
    private alertSer: AlertService
  ) { }


  UserForm!: FormGroup;
  ngOnInit() {
    this.UserForm = this.fb.group({
      firstTimeFlag: new FormControl('T'),
      userName: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      // genderFlag: new FormControl('M', Validators.required),
      realm: new FormControl('IVISUSA'),
      emailId: new FormControl('', Validators.required),
      contactNumber: new FormControl('(844) GET-IVIS', Validators.required),
      alternateContactNumber: new FormControl(''),
      addressLine1: new FormControl('', Validators.required),
      addressLine2: new FormControl(''),
      country: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      // district: new FormControl('', Validators.required),
      pincode: new FormControl(null, Validators.required),
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
    });
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

  fillShortName(event: any) {
    this.UserForm.get('emailId')!.setValue(event.target.value + '@gmail.com');
  }

  showLoader: boolean = false;
  createUser() {
    if(this.UserForm.valid) {
      this.showLoader = true;
      this.userSer.createUser(this.UserForm.value).subscribe((res: any) => {
        this.showLoader = false;
        if(res.statusCode == 200) {
          this.newItemEvent.emit();
          this.alertSer.success(res.message);
        } else {
          this.alertSer.error(res.message);
        }
      }, (err: any) => {
        this.showLoader = false;
        this.alertSer.error(err.error.message);
      });
    }
  }

  // checkbox: boolean = false;
  // onCheck() {
  //   this.checkbox = !this.checkbox;
  // }

}

