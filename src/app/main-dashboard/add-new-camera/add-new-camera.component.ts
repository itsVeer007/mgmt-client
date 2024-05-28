import { Component, EventEmitter, HostListener, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/services/alert.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-add-new-camera',
  templateUrl: './add-new-camera.component.html',
  styleUrls: ['./add-new-camera.component.css'],
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
export class AddNewCameraComponent {

  @Output() newItemEvent = new EventEmitter<boolean>();
  // http: any;
  user: any;

  constructor(private router: Router,
     private siteSer: SiteService, 
     private fb:FormBuilder,
      private storageService:StorageService,
       private alertSer:AlertService,
       private http:HttpClient,
       public dialog: MatDialog,
      ) { }
  
  createCamera!: FormGroup;

  siteData:any=[]
  ngOnInit(): void {
    this.siteData= this.storageService.get("siteIds"); 
  
    this.createCamera=this.fb.group({
      name: new FormControl(''),
      rtspUrl: new FormControl(''),
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      width: new FormControl(null),
      height: new FormControl(null),
      fps: new FormControl(0),
      HLSUrl: new FormControl(''),
      ptz: new FormControl(1),
      priority: new FormControl(''),
      active: new FormControl(''),
      httpTunnel: new FormControl(''),
      videoServerName: new FormControl(''),
      portNo: new FormControl(0),
      centralBoxId: new FormControl(0),
      httpPortNo: new FormControl(0),
      indexNo: new FormControl(0),
      gtEnabled: new FormControl(''),
      displayName: new FormControl(''),
      internalIp: new FormControl(''),
      internalPort: new FormControl(0),
      s3RequestName: new FormControl(''),
      events: new FormControl(''),
      eventsOnAWS: new FormControl(''),
      eventsOnCPE: new FormControl(''),
      eventsServerIp: new FormControl(''),
      audioSpeakerType: new FormControl(''),
      audioUrl: new FormControl(''),
      monitoring: new FormControl(''),
      unitId: new FormControl('', Validators.required),
      noOfCameras: new FormControl('', Validators.required)
    })
  }

  closeCamera() {
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

  @ViewChild('editSiteDialog') editSiteDialog = {} as TemplateRef<any>;
  currentItem: any
  openEditPopup(item: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.dialog.open(this.editSiteDialog);
  }

  camList: any = [];
  addCamera(data: any) {
    this.camList = [];
    for(let i = 0; i < data.noOfCameras; i++) {
      let index = (i + 1).toString().padStart(2, '0');
      let index1;
      if(i < 10) {
        index1 = (i + 1).toString().padStart(2, 'C');
      } else {
        index1 = (i + 1).toString().padStart(3, 'C');
      }
      let x = `Camera ${index}`;
      let y = `${this.createCamera.value.unitId}${index1}`;

      this.camList.push({
        cameraId: y,
        name: x,
        rtspUrl: this.createCamera.value.rtspUrl,
        userName: this.createCamera.value.userName,
        password: this.createCamera.value.password,
        width: this.createCamera.value.width,
        height: this.createCamera.value.height,
        fps: this.createCamera.value.fps,
        HLSUrl: this.createCamera.value.HLSUrl,
        indexNo: this.createCamera.value.indexNo,
        centralBoxId: this.createCamera.value.centralBoxId,
        ptz: this.createCamera.value.ptz,
        priority: this.createCamera.value.priority,
        active: this.createCamera.value.active,
        httpTunnel: this.createCamera.value.httpTunnel,
        videoServerName: this.createCamera.value.videoServerName,
        portNo: this.createCamera.value.portNo,
        httpPortNo: this.createCamera.value.httpPortNo,
        gtEnabled: this.createCamera.value.gtEnabled,
        displayName: x,
        internalIp: this.createCamera.value.internalIp,
        internalPort: this.createCamera.value.internalPort,
        s3RequestName: this.createCamera.value.s3RequestName,
        events: this.createCamera.value.events,
        eventsOnAWS: this.createCamera.value.eventsOnAWS,
        eventsOnCPE: this.createCamera.value.eventsOnCPE,
        eventsServerIp: this.createCamera.value.eventsServerIp,
        audioSpeakerType: this.createCamera.value.audioSpeakerType,
        audioUrl: this.createCamera.value.audioUrl,
        monitoring: this.createCamera.value.monitoring,
        unitId: this.createCamera.value.unitId,
        noOfCameras: this.createCamera.value.noOfCameras
      });
    }
  }


  submit(data:any, event: any) {
    if(this.createCamera.valid){
      this.siteSer.createCamera(data).subscribe((res:any) =>{
        if(res.statusCode===200){
          event.target.disabled = true;
          this.alertSer.snackSuccess(res.message)
        }
        else{
          this.alertSer.error(res.message)
        }
      }, (err: any) => {
        this.alertSer.error(err.error.message)
      })
    }
  }

  update() {
    console.log(this.currentItem);
    this.siteSer.createCamera(this.currentItem).subscribe((res:any) =>{
      console.log(res)
      if(res.statusCode===200){
        this.alertSer.success(res.message)
      }
      else{
        this.alertSer.error(res.message)
      }
    }, (err: any) => {
      this.alertSer.error(err.error.message)
    })
  }

}
