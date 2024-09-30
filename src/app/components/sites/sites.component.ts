import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SiteService } from 'src/services/site.service';
import { AssetService } from 'src/services/asset.service';
import { StorageService } from 'src/services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/services/alert.service';
import { UserService } from 'src/services/user.service';
import { EditFormComponent } from 'src/app/utilities/edit-form/edit-form.component';
import { EditCameraComponent } from '../cameras/edit-camera/edit-camera.component';


@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css']
})
export class SitesComponent implements OnInit {

  constructor(
    private siteSer: SiteService,
    private assetSer: AssetService,
    public dialog: MatDialog,
    private storageSer: StorageService,
    private fb:FormBuilder,
    private alertSer: AlertService,
    private userSer: UserService
  ) { }

  tableData: any = [];
  newTableData: any = [];
  showLoader: boolean = false;
  searchText: any;

  active: any;
  inActive: any = [];
  onHold: any = [];
  tempSite: any;
  // siteData: any;
  createCenteralBox!: FormGroup;

  user:any
  ngOnInit(): void {
    this.user = this.storageSer.get('user');
    // console.log(user)
    // this.tempSite = this.storageSer.get('temp_sites');
    // this.siteData = this.storageSer.get('temp_sites')?.sort((a: any, b: any) => a.siteId < b.siteId ? -1 : a.siteId > b.siteId ? 1 : 0);
    // this.tableData = this.siteData;
    // this.newTableData = this.tableData;
    this.getSitesListForUserName()

    this.createCenteralBox=this.fb.group({
      unitName: new FormControl('', Validators.required),
      siteId: new FormControl(''),
      unitId: new FormControl('', Validators.required),
      createdBy: new FormControl(''),
      description: new FormControl(''),
      password: new FormControl(''),
      centeralBoxUrl: new FormControl(''),
      noOfActiveCameras: new FormControl(0),
      remarks: new FormControl('')

    })
  }

// BharadwajAPIS
  currentItem: any;
  @ViewChild('viewCamerasDialog') viewCamerasDialog = {} as TemplateRef<any>;
  cameras: any = [];
  getCamerasForSiteId(data: any) {
    this.currentItem = data;
    this.dialog.open(this.viewCamerasDialog);
    this.siteSer.getCamerasForSiteId(data.siteId).subscribe((response: any) => {
      this.siteSer.cameras_sub.next(response);
      this.siteSer.cameras_sub.subscribe((res) => this.cameras = res);
    })
  }

  
  // @ViewChild('editCameraDialog') editCameraDialog = {} as TemplateRef<any>;
  currentCamera: any;
  cameraSelectTypes: any = ["status", "audioSpeakerType", "timezone"];
  openEditCamera(item: any) {
    // this.currentCamera = JSON.parse(JSON.stringify(item));
    // this.dialog.open(this.editCameraDialog);
    this.storageSer.current_sub.next({ type: 'site', data: item });
    this.dialog.open(EditCameraComponent);
    // this.storageSer.edit_sub.next({objectEntries: item, selectTypes: this.cameraSelectTypes});
    // this.dialog.open(EditFormComponent)
  }


  updateCamera() {
    // let isHttps: boolean = this.currentCamera.httpUrl.startsWith('https');
    // let isHttp: boolean = this.currentCamera.httpUrl.startsWith('http');
    // let isRtsp: boolean = this.currentCamera.rtspUrl.startsWith('rtsp');
    // let rtsp: any = this.currentCamera.rtspUrl.split('@');
    // let webrtsp: any = this.currentCamera.httpUrl.split('/');
    // if(isHttps) {
    //   if(this.currentCamera.httpUrl) {
    //     this.currentCamera.httpUrl = this.currentCamera.httpUrl.slice(8);
    //   }
    //   if(this.currentCamera.audiUrl) {
    //     this.currentCamera.audiUrl = this.currentCamera.audiUrl.slice(8);
    //   }
    //   if(this.currentCamera.hlsTunnel) {
    //     this.currentCamera.hlsTunnel = this.currentCamera.hlsTunnel.slice(7);
    //   }
    // } else if(isHttp) {
    //   if(this.currentCamera.httpUrl) {
    //     this.currentCamera.httpUrl = this.currentCamera.httpUrl.slice(7);
    //   }
    //   if(this.currentCamera.audiUrl) {
    //     this.currentCamera.audiUrl = this.currentCamera.audiUrl.slice(7);
    //   }
    //   if(this.currentCamera.hlsTunnel) {
    //     this.currentCamera.hlsTunnel = this.currentCamera.hlsTunnel.slice(7);
    //   }
    // }
    // if(isRtsp) {
    //   if(this.currentCamera.rtspUrl) {
    //     this.currentCamera.rtspUrl = rtsp[rtsp.length - 1];
    //   }
    // }

    // if(isHttps) {
    //   if(this.currentCamera.httpUrl) {
    //     this.currentCamera.httpUrl = webrtsp[2];
    //   }
    // }

    this.currentCamera.videoServerName = this.currentCamera.httpUrl;
    delete this.currentCamera.httpUrl;
    this.siteSer.updateCamera(this.currentCamera).subscribe((res:any) => {
      if(res.statusCode == 200) {
        this.getCamerasForSiteId(this.currentItem);
        this.alertSer.success(res.message)
      } else {
        this.alertSer.error(res.message);
      }
    })
  }


  // BharadwajAPIS
  getSiteFullDetails(item:any) {
    this.siteSer.getSiteFullDetails(item).subscribe((res:any)=> {
      // console.log(res);
    })
  }


  final:any
  getSitesListForUserName() {
    this.showLoader = true;
    this.siteSer.getSitesListForUserName().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      if(res?.Status == 'Success') {
        // this.final = res.sites.sort((a: any, b: any) => a.siteName < b.siteName ? -1 : a.siteName > b.siteName ? 1 : 0);
        this.tableData = res.sites.sort((a: any, b: any) => a.siteName < b.siteName ? -1 : a.siteName > b.siteName ? 1 : 0);
        this.newTableData = this.tableData;
      }
      }, (err: any) => {
        this.showLoader = false;
    });
  }




  deviceData: any;
  inputToDevices: any;
  getDevices(siteId: any) {
    this.assetSer.listDeviceBySiteId(siteId).subscribe((res: any) => {
      this.deviceData = res.flatMap((item: any) => item.adsDevices);
      this.inputToDevices = this.deviceData;
      // console.log('site',this.inputToDevices);
    })
  }

  engineerDetail: any;
  onGetEngineer(id: any) {
    this.siteSer.getEngineer(id).subscribe((res: any) => {
      this.engineerDetail = res.Engineer_details;
      // console.log(this.engineerDetail);
    })
  }

  engineerId = 0;
  engineerView(e: any, i: any) {
    this.engineerId = i;
    var x = e.target.nextElementSibling;
    x.style.display == 'none' ? x.style.display = 'flex' : x.style.display = 'none';
  }

  @ViewChild('addCentralBoxDialog') addCentralBoxDialog = {} as TemplateRef<any>;
  openAddCentralbox() {
    this.createCenteralBox.reset()
    this.dialog.open(this.addCentralBoxDialog)
    this.siteSer.getCentralbox(this.currentItem).subscribe((res: any) => {
        // console.log(res)
      })
    }
    
  @ViewChild('viewCentralBoxDialog') viewCentralBoxDialog = {} as TemplateRef<any>;
  onGetCentralboxDetail: any;
  getCentalBox(data: any) {
    this.currentItem = data
    this.siteSer.getCentralbox(data).subscribe((res: any) => {
      this.onGetCentralboxDetail = res.centralBox;
    })
    this.dialog.open(this.viewCentralBoxDialog)
  }

  createCentralBox() {
    if(!this.createCenteralBox.valid) return;
    this.createCenteralBox.value.siteId = this.currentItem.siteId;
    this.siteSer.addCentralBox(this.createCenteralBox.value).subscribe((res: any) => {
      if(res.statusCode === 200) {
        this.alertSer.success(res.message);
        this.dialog.closeAll();
        this.getCentalBox(this.currentItem);
      } else {
        this.alertSer.error(res.message)
      }
    });
  }

  saveSiteData(site: any) {
    this.storageSer.set('temp_sites', site);
  }

  /* searches */
  siteSearch: any;
  siteNg: any = 'All'
  searchSites(event: any) {
    this.siteSearch = (event.target as HTMLInputElement).value
  }

  filterSites(site: any) {
    if(site != 'All') {
      this.newTableData =  this.tableData.filter((item: any) => item.siteId == site)
    } else {
      this.newTableData = this.tableData;
    }
  }

  showAddSite: boolean = false;
  showAddDevice: boolean = false;
  showInstallation: boolean = false;
  showCamera: boolean = false;
  currentItem1: any;
  show(value: string, data?: any) {
    if(value == 'site') {
      this.showAddSite = true
    }
    if(value == 'device') {
      this.showAddDevice = true
    }
    if(value == 'installation') {
      this.showInstallation = true
    }
    if(value == 'camera') {
      this.showCamera = true
      this.currentItem1 = data;
    }
  }

  closenow(type: string) {
    if (type == 'site') {
      this.showAddSite = false
    }
    if (type == 'device') {
      this.showAddDevice = false
    }
    if(type == 'installation') {
      this.showInstallation = false
    }
    if(type == 'camera') {
      this.showCamera = false
    }
  }

  addressid = 0;
  addressView(e: any, i: any) {
    this.addressid = i;
    // var x = e.target.nextElementSibling;
    // console.log("AddressView:: ",x)
    // this.address = !this.address;
  }

  currentid = 0;
  closeDot(e: any, i: any) {
    this.currentid = i;
    var x = e.target.parentNode.nextElementSibling;
    // console.log("Close-Click:: ",x);
    if (x.style.display == 'none') {
      x.style.display = 'flex';
    } else {
      x.style.display = 'none';
    }
  }

  masterSelected: boolean = false;
  SelectAll: boolean = false;
  selectedAll: any;
  selectAll() {
    for (var i = 0; i < this.tableData.length; i++) {
      // console.log(this.tableData[i])
      this.tableData[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.tableData.every(function (item: any) {
      // console.log(item)
      return item.selected == true;
    })
  }


  @ViewChild('viewSiteDialog') viewSiteDialog = {} as TemplateRef<any>;
  openViewPopup(item: any) {
    this.siteSer.getSiteFullDetails(item).subscribe((res:any)=>{
      this.currentItem = res.siteDetails;
    })
    this.dialog.open(this.viewSiteDialog);
  }

  currentSite:any;
  timeZones: any;
  getTimeZones() {
    this.siteSer.gettimeZones().subscribe((res: any) => {
      this.timeZones = res;
    })
  }

  @ViewChild('editSiteDialog') editSiteDialog = {} as TemplateRef<any>;
  openEditPopup(item: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.siteSer.getSiteFullDetails(item).subscribe((res:any)=> {
      // console.log(res);
      this.getTimeZones();
      this.currentSite=res.siteDetails;
      
    })
    this.dialog.open(this.editSiteDialog);
  }


resultSite:any;
  confirmEditRow() {
    this.siteSer.updateSiteDetails(this.currentSite).subscribe((res:any)=>{
      if(res.statusCode == 200) {
        this.getSitesListForUserName()
        this.alertSer.success(res?.message);
      } else {
        this.alertSer.error(res?.message)
      }
    })
  }

  @ViewChild('deleteSiteDialog') deleteSiteDialog = {} as TemplateRef<any>;
  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteSiteDialog);
  }

  confirmDeleteRow() {
    // console.log(this.currentItem);
    this.tableData = this.tableData.filter((item: any) => item.siteId !== this.currentItem.siteId);
  }


  /* checkbox control */
  viewArray: any = [];
  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      this.dialog.open(this.viewSiteDialog, this.dialog.open(this.editSiteDialog));
    }
  }

  ViewByCheckbox(itemV: any, i: any, e: any) {
    var checked = (e.target.checked);
    if (checked == true && this.viewArray.includes(itemV) == false) {
      this.viewArray.push(itemV);
      this.currentItem = this.viewArray[(this.viewArray.length - 1)];
    }
    if (checked == false && this.viewArray.includes(itemV) == true) {
      this.viewArray.splice(this.viewArray.indexOf(itemV), 1)
    }
  }

  editArray: any = [];
  editBySelectedOne() {
    if (this.editArray.length > 0) {
      this.dialog.open(this.editSiteDialog, this.dialog.open(this.editSiteDialog));
    }
  }

  EditByCheckbox(itemE: any, i: any, e: any) {
    var checked = (e.target.checked);
    if (checked == true && this.editArray.includes(itemE) == false) {
      this.editArray.push(itemE);
      this.currentItem = this.editArray[(this.editArray.length - 1)];
    }
    if (checked == false && this.editArray.includes(itemE) == true) {
      this.editArray.splice(this.editArray.indexOf(itemE), 1)
    }
  }

  deletearray: any = [];
  deleteMultiRecords(item: any, i: any, e: any) {
    var checked = (e.target.checked);
    // console.log("Delete Multiple Records:: ", item);
    if (this.deletearray.length == 0) { this.deletearray.push(item) }
    this.deletearray.forEach((el: any) => {
      if (el.siteId != item.siteId && checked) {
        this.deletearray.push(item);
        this.deletearray = [...new Set(this.deletearray.map((item: any) => item))]
      }
      if (el.siteId == item.siteId && !checked) {
        var currentindex = this.deletearray.indexOf(item);
        this.deletearray.splice(currentindex, 1)
      }
    });
  }

  deleteSelected() {
    if (this.selectedAll == false) {
      this.deletearray.forEach((el: any) => {
        this.tableData = this.tableData.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.tableData.forEach((el: any) => {
        this.tableData = this.tableData.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }

  sorted = false;
  sort(label:any) {
    this.sorted = !this.sorted;
    var x = this.tableData;
    if(this.sorted==false){
      x.sort((a:string, b:string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    }else{
      x.sort((a:string, b:string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }


  siteUsers:any=[];
  getSiteUserDetails(data:any){
    this.userSer.getSiteUserDetails(data).subscribe((res:any)=>{
      this.siteUsers=res.usersDetails;
    })
    
  }
}


