import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.css'],
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
export class AddNewUserComponent implements OnInit {

  constructor(private router:Router, private apiser: ApiService, private fb: FormBuilder) { }

  // @Input() show:any;

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
  // error=false;


  UserForm: any =  FormGroup;

  user = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    roleList: [],
    email: "",
    gender: "",
    realm: "",
    contactNumber1: "",
    contactNumber2: "",
    country: "",
    addressLine1: "",
    addressLine2: "",
    district: "",
    state: "",
    city: "",
    pin: "",
    employee: "F",
    employeeId: "",
    accesstoken: "",
    callingUsername: "",
    callingSystemDetail: "admin",
    safetyEscort: "F"
  }


  ngOnInit() {
    this.UserForm = this.fb.group({
      'userName': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required),
      'first': new FormControl('', Validators.required),
      'last': new FormControl('', Validators.required),
      // 'gender': this.fb.group({
      //        cityName: ['']
      //       }),
      // 'employeeId': new FormControl(''),
      'role': new FormControl('', Validators.required),
      'gender': new FormControl('', Validators.required),
      'realm': new FormControl('', Validators.required),
      'email': new FormControl('', Validators.required),
      'contact_1': new FormControl('', Validators.required),
      'contact_2': new FormControl(''),
      'address_1': new FormControl('', Validators.required),
      'address_2': new FormControl(''),
      'country': new FormControl('', Validators.required),
      'state': new FormControl('', Validators.required),
      'city': new FormControl('', Validators.required),
      'pincode': new FormControl('', Validators.required),
      'district': new FormControl('', Validators.required),
      'safetyEscort': new FormControl(''),
      // 'employee': new FormControl('')
    });

    // this.getUserDetails();
  }

  email: string = "";
  getUserDetails(){
    this.apiser.getUser(this.email).subscribe((res:any)=>{
      console.log(res)
      if(res.Status == 'Success'){
        this.user.username= "";
        this.user.password= res.password;
        this.user.firstname= res.firstName;
        this.user.lastname= res.lastName;
        this.user.roleList = res.roleList;
        this.user.email= res.email;
        this.user.gender= res.gender;
        this.user.realm= res.realm;
        this.user.contactNumber1= res.contactNo1;
        this.user.contactNumber2= res.contactNo2;
        this.user.country= res.country;
        this.user.addressLine1= res.address_line1;
        this.user.addressLine2= res.address_line2;
        this.user.district= res.district;
        this.user.state= res.state;
        this.user.city= res.city;
        this.user.pin= res.pin;
        this.user.employee= res.employee;
        this.user.employeeId= res.empId;
        this.user.accesstoken= res.access_token;
        this.user.callingUsername= res.callingUsername;
        this.user.callingSystemDetail = "portal";
        this.user.safetyEscort = res.safetyescort;
      }
    })
  }

  closeAddUser() {
    this.newItemEvent.emit(false);
  }

  openAnotherForm(newform:any) {
    this.newItemEvent.emit(false);
    localStorage.setItem('opennewform', newform)
  }

  isValidate: boolean = false;
  submit() {
    console.log("Userform: ",this.UserForm.value);
    console.log("Payload: ",this.user);

    this.isValidate = true;
    if(this.UserForm.valid) {
      this.apiser.addUser(this.user).subscribe((res: any) => {
        if(res.Status == "Success") {
          localStorage.setItem('userCreated', JSON.stringify(res));
        }
      });
    }
  }


  // checkbox: boolean = false;
  // onCheck() {
  //   this.checkbox = !this.checkbox;
  // }

}

