import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/utilities/api.service';

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

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<boolean>();
  
  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    var x = <HTMLElement>document.getElementById(`user`);
    if (x != null) {
      if (!x.contains(e.target)) {
        this.closeAddUser(false);
      }
    }
  }
  
  closeAddUser(value:boolean) {
    this.newItemEvent.emit(value);
  }


  constructor(private router:Router, 
              private apiser: ApiService, 
              private fb: FormBuilder) { }

  error=false;
  user = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    roleList: [  ],
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
    employee: "",
    employeeId: "",
    accesstoken: "",
    callingUsername: "",
    callingSystemDetail: "admin",
    safetyEscort: ""
  }

  UserForm: any =  FormGroup;
  ngOnInit() {
    // this.employeeForm = new FormGroup({
    //   fullName: new FormControl(),
    //   email: new FormControl()
    // });

    this.UserForm = this.fb.group({
      'userName': new FormControl(''),
      'password': new FormControl(''),
      'first': new FormControl(''),
      'last': new FormControl(''),
      // 'role': this.fb.group({
      //        cityName: ['']
      //       }),
      'role': new FormControl(''),
      'gender': new FormControl(''),
      'active': new FormControl(''),
      'realm': new FormControl(''),
      'email': new FormControl(''),
      'phone': new FormControl(''),
      'country': new FormControl(''),
      'state': new FormControl(''),
      'city': new FormControl(''),
      'pincode': new FormControl(''),
      'area': new FormControl('')   
    });

    // const addUser = {
    //   'fullName':'HARI CHANDANA',
    //   'email':'hari@gmail.com'
    // };
    // this.employeeForm.setValue(addUser);
  }

  onSubmit(): void {
  }

  openAnotherForm(newform:any) {
    // this.newItemEvent.emit(false);
    localStorage.setItem('opennewform', newform)
    this.closeAddUser(false);
  }

  submit(){
    console.log("Entered in AddUser:: ",this.UserForm.value);
    // console.log("Payload:: ",this.user);
    // this.apiser.addUser(this.user).subscribe((res: any)=>{
    //   console.log(res);
    //   if(res.Status == "Success"){
    //   }
    // });
  }

}

