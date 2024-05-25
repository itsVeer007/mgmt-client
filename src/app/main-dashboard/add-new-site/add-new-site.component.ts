import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { SiteService } from 'src/services/site.service';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/services/storage.service';
import { AlertService } from 'src/services/alert.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-new-site',
  templateUrl: './add-new-site.component.html',
  styleUrls: ['./add-new-site.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddNewSiteComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<boolean>();
  // http: any;
  user: any;

  constructor(private router: Router,
     private siteSer: SiteService, 
     private fb:FormBuilder,
      private storageService:StorageService,
       private alertSer:AlertService,
       private http:HttpClient
      ) { }
  
  createSite!: FormGroup;

  siteData:any=[]
  ngOnInit(): void {
    this.siteData= this.storageService.get("siteIds")   
  
    this.createSite=this.fb.group({
      siteName: new FormControl(''),
      phoneNo: new FormControl(''),
      email: new FormControl(''),
      website: new FormControl(''),
      
      
      busVerticalId: new FormControl(null),
      customerId: new FormControl(null),

      latitude: new FormControl(''),
      longitude: new FormControl(''),

      createdBy: new FormControl(1),
      siteShortName: new FormControl(''),
      remarks: new FormControl(''),
      country: new FormControl(''),
      state: new FormControl(''),
      timezone: new FormControl(''),
      live: new FormControl(''),
      alerts: new FormControl(''),
      timeLapse: new FormControl(''),
      insights: new FormControl(''),
      advertisements: new FormControl(''),
      safetyEscort: new FormControl(''),
      sensors: new FormControl(''),
      esclLeve1: new FormControl(''),
      name: new FormControl(''),
      contactNo: new FormControl(''),
      emailId: new FormControl(''),
      localLEcontactNo: new FormControl(''),
      whatsapp: new FormControl(''),
      dotComWorking: new FormControl(''),
      line_1: new FormControl(''),
      line_2: new FormControl(''),
      area: new FormControl(''),
      district: new FormControl(''),
      pin: new FormControl(''),

      isCheck: new FormControl(false)

    })
    // console.log(this.show)
    this.getCountry()
  }

  whNum: any
  copyNumber() {
    let isChecked = this.createSite.value.isCheck;
    let num = this.createSite.value.contactNo;
    // this.whNum = this.createSite.value.whatsapp;

    !isChecked ? this.whNum = num : this.whNum = '';
  }

  dotcomnum: any
  dotcomcopyNumber() {
    let isChecked = this.createSite.value.isCheck;
    let num = this.createSite.value.contactNo;
    // this.whNum = this.createSite.value.whatsapp;

    !isChecked ? this.dotcomnum = num : this.dotcomnum = '';
  }

  closeAddSite() {
    this.newItemEvent.emit();
  }

  isShown: boolean = false;
  toggleShowOnOff() {
    this.isShown = !this.isShown;
  }

  Monitoring: boolean = false;
  toggleShowMonit() {
    this.Monitoring = !this.Monitoring;
  }

  Business: boolean = false;
  toggleShowBusiness() {
    this.Business = !this.Business;
  }

  existSecuity: boolean = false;
  toggleShowExistSecuity(value: any, type: any) {
    if (type == 'security') {
      if (value == 'on') {
        this.existSecuity = true;
      }
      else {
        this.existSecuity = false;
      }
    }
  }

  internet: boolean = false;
  toggleShowInternet(value: any, type: any) {
    if (type == 'internet') {
      if (value == 'on') {
        this.internet = true;
      }
      else {
        this.internet = false;
      }
    }
  }

  moni: boolean = false;
  monitoring() {
    this.moni = !this.moni;
  }

  intell: boolean = false;
  businessIntell() {
    this.intell = !this.intell;
  }

  openAnotherForm(newform: any) {
    this.newItemEvent.emit();
  }

  latitude: any;
  longitude: any;
  getLocation() {
    navigator.geolocation.getCurrentPosition((latlong)=> {
      this.latitude =(latlong.coords.latitude);
      this.longitude = (latlong.coords.longitude);
    }, function () {
      alert('User not allowed')
    }, { timeout: 10000 })
  }

  selectedFile: any = null;
  selectedFiles:  Array<any> = [];
  onFileSelected(event: any) {
    if(typeof(event) == 'object') {
      this.selectedFile = event.target.files[0] ?? null;
      this.selectedFiles.push(this.selectedFile);
    }
  }

  deleteFile() {
    this.selectedFiles.pop();
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
    this.createSite.value.state = '';
    this.createSite.value.district = '';
  }

  cityList: any
  filterCity(val: any) {
    let x = this.stateList.filter((el: any) => el.stateName == val);
    this.cityList = x.flatMap((el: any) => el.cities);
    this.createSite.value.district = '';
  }

  submit(){
    if(this.createSite.valid){
      this.siteSer.createSite(this.createSite.value).subscribe((res:any) =>{
        console.log(res)
        if(res.statusCode===200){
          this.alertSer.success(res.message)
          
        }
        else{
          this.alertSer.error(res.message)
        }
      }, (err) => {
        this.alertSer.error(err.error.message)
      })
    }
    // console.log(this.createSite.value)
  }

}
