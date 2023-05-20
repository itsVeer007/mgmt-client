import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AdInfoComponent } from '../assets/ad-info/ad-info.component';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AssetService } from 'src/services/asset.service';
import { MetadataService } from 'src/services/metadata.service';
import { HttpClient } from '@angular/common/http';
import { DeviceService } from 'src/services/device.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    var x = <HTMLElement>document.getElementById(`plus-img${this.currentid}`);
    var y = <HTMLElement>document.getElementById(`icons-site`);

    if (x != null) {
      if (!x.contains(e.target)) {
        if (x.style.display == 'flex' || x.style.display == 'block') {
          x.style.display = 'none';
        }
      }
    }

    // if (y != null) {
    //   console.log(`icons-site`);
    //   if (!y.contains(e.target)) {
    //     this.icons1 = false;
    //   }
    // }
  }



  searchText: any;
  // deviceId: string = '';
  // activeAssets: number = 0;
  showLoader: boolean = false;

  pending: any[] = [];
  added: any[] = [];
  removed: any[] = [];
  synced: any[] = [];
  sendToController: any[] = [];

  constructor(
    private http: HttpClient,
    private assetService: AssetService,
    private dropDown: MetadataService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private devSercice: DeviceService,
  ) { }

  currentDateTime: any;
  endDateTime: any;
  ngOnInit(): void {
    this.currentDateTime =this.datepipe.transform(new Date().toLocaleString('en-us',{month:'short', day: 'numeric', year:'numeric'}));
    this.endDateTime =this.datepipe.transform(new Date('9999-12-31').toLocaleString('en-us',{month:'short', day: 'numeric', year:'numeric'}));
    this.getAssetData();
    this.ongetDeviceMode();
    this.ongetStatus();
    this.getDevices();
    this.toGetSitesList();
  }


  assetTable: any[] = [];
  inputToAddAsset: any;
  tableData: any;
  siteIdList: any;
  siteIdToTable: any
  getAssetData() {
    this.showLoader = true;
    this.assetService.getAssets().subscribe((res: any) => {
      console.log('res', res);
      this.showLoader = false;

      this.inputToAddAsset = res;
      const assets = res.flatMap((item: any) => item.assets);
      this.assetTable = assets;

      // for(let item of res) {
      //   for(let el of item.assets) {
      //     console.log(el)
      //   }
      // }
      // this.assetTable.push(res.assets)

      this.tableData = this.assetTable;



      // let x = res.filter((el: any) => {

      // })

      /* for site id's */
      const site_id = res.flatMap((item: any) => item.siteId);
      this.siteIdToTable = site_id;
      for(let id of site_id) {
        this.siteIdList = id;
      }
      // console.log('site_id', this.siteIdList);

      //status count
      for(let item of this.assetTable) {
        if(item.status == 1) {
          this.pending.push(item);
        } else if(item.status == 2) {
          this.added.push(item);
        } else if(item.status == 4) {
          this.synced.push(item);
        } else if(item.status == 5) {
          this.removed.push(item);
        }
      }
    })
  }

  /* Main */
  siteNameId: any;
  toGetSitesList() {
    // this.devSercice.getSitesList().subscribe((res: any) => {
    //   console.log(res);
    //   this.siteNameId = res;
    // })
  }


  /* Select Filter */
  adsDevicesBySite: any;
  getAdsDevicesBySite(siteId: any) {
    // this.devSercice.getAdsDevicesBySite(siteId).subscribe((res: any) => {
    //   console.log(res);
    //   this.adsDevicesBySite = res;
    // })
  }

  assetsByDevice(devId: any) {
    // this.devSercice.getAssetsByDevice(devId).subscribe((res: any) => {
    //   console.log(res)
    // })
  }


  siteIds: any = [];
  data: any
  getDevices() {
    // this.devSercice.getDeviceList().subscribe((res: any) => {
    //   this.data = res;
    //   for(let item of res) {
    //     this.siteIds.push(item.siteId)
    //   }
    // })
  }

  devIds: any = [];
  filterDevices(siteId: any) {
    // let x = this.data.filter((el: any) => {
    //   return el.siteId == siteId
    // })
    // this.devIds=[];
    // for(let item of x[0].adsDevices) {
    //   this.devIds.push(item.deviceId)
    // }
  }


  siteSearch: any;
  searchForSiteInput(e: Event) {
    this.siteSearch = (e.target as HTMLInputElement).value;
  }

  searchForSiteOption(data: any) {
    let dataSome = this.tableData;
      this.assetTable = dataSome.filter((el: any) => el.id == data);
  }

  modeSearch: any;
  searchForModeInput(e: Event) {
    this.modeSearch = (e.target as HTMLInputElement).value;
  }

  searchForModeOption(data: any) {
    let dataSome = this.tableData;
      this.assetTable = dataSome.filter((el: any) => el.deviceModeId == data);
  }


  deviceMode: any;
  ongetDeviceMode() {
    this.dropDown.getMetadata().subscribe((res: any) => {
      for(let item of res) {
        if(item.type == 'Device_Mode') {
          this.deviceMode = item.metadata;
        }
      }
      // console.log(this.deviceMode);
    })
  }


  assetStatus: any;
  ongetStatus() {
    this.dropDown.getMetadata().subscribe((res: any) => {
      for(let item of res) {
        if(item.type == 'Asset_Status') {
          this.assetStatus = item.metadata;
        }
      }

      // console.log(this.assetStatus);
    })
  }


  showIconView: boolean = false;
  showIconEdit: boolean = false;
  showIconDelete: boolean = false;
  showIconView1: boolean = false;
  showIconEdit1: boolean = false;
  showIconDelete1: boolean = false;

  currentid = 0;
  closeDot(e: any, i: any) {
    this.currentid = i;
    var x = e.target.parentNode.nextElementSibling;
    if (x.style.display == 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  }


  showAsset: boolean = false;

  showAddAsset() {
    this.showAsset = true;
    this.dialog.closeAll();
  }

  closenow(value: any, type: String) {
    if (type == 'asset') { this.showAsset = value; }

    // setTimeout(() => {
    //   var openform = localStorage.getItem('opennewform');
    //   if (openform == 'showAddSite') { this.showAddSite = true; }
    //   if (openform == 'showAddCamera') { this.showAddCamera = true; }
    //   if (openform == 'showAddCustomer') { this.showAddCustomer = true; }
    //   if (openform == 'showAddBusinessVertical') { this.showAddBusinessVertical = true; }
    //   if (openform == 'showAddUser') { this.showAddUser = true; }
    //   if (openform == 'additionalSite') { this.showSite = true; }
    //   localStorage.setItem('opennewform', '');
    // }, 100)
  }


  masterSelected: boolean = false;

  // allchecked(e:any){
  //   if(document.querySelector('#allchecked:checked')){
  //     this.masterSelected = true;
  //   }else {
  //     this.masterSelected = false;
  //   }
  // }


  selectedAll: any;
  selectAll() {
    for (var i = 0; i < this.assetTable.length; i++) {
      // console.log(this.assetTable[i])
      this.assetTable[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.assetTable.every(function (item: any) {
      // console.log(item)
      return item.selected == true;
    })
  }


  deleteRow: any;
  deleteRow1(item: any, i: any) {
    console.log("DELETEROW:: ", item);
    setTimeout(() => {
      this.assetTable.splice(i, 1);
    }, 1000);
  }

  deletePopup: boolean = true;
  confirmDeleteRow() {
    console.log("ToBE DELETED:: ", this.currentItem);
    this.assetTable = this.assetTable.filter((item: any) => item.siteId !== this.currentItem.siteId);
    this.deletePopup = true;
  }

  closeDeletePopup() {
    this.deletePopup = true;
  }

  currentItem: any;
  openDeletePopup(item: any, i: any) {
    this.currentItem = item;
    // console.log("Selected Item:: ", item);
    this.deletePopup = false;
    // console.log("Open Delete Popup:: ",this.deletePopup);
    // console.log(this.assetTable.siteId);
  }


  editPopup: boolean = true;
  confirmEditRow() {
    console.log("TO BE EDITED:: ", this.currentItem);
    // this.assetTable= this.assetTable.filter((item:any) => item.siteId !== this.currentItem.siteId);
    this.editPopup = true;
  }

  closeEditPopup() {
    this.editPopup = true;
  }

  openEditPopup(item: any, i: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    // this.currentItem = item;
    // console.log("Selected Item:: ", item);
    this.editPopup = false;
    // console.log("Open Delete Popup:: ",this.editPopup);
    // console.log(this.assetTable.siteId);
  }

  editArray: any = [];
  EditByCheckbox(itemE: any, i: any, e: any) {
    var checked = (e.target.checked);
    // console.log("Edit By Checkbox:: ",itemE);
    // console.log("Edit Array::" ,this.editArray);
    // console.log("present in array : "+this.editArray.includes(itemE),  " checked : "+ checked)
    if (checked == true && this.editArray.includes(itemE) == false) {
      this.editArray.push(itemE);
      this.currentItem = this.editArray[(this.editArray.length - 1)];
    }
    if (checked == false && this.editArray.includes(itemE) == true) {
      this.editArray.splice(this.editArray.indexOf(itemE), 1)
    }
  }

  editBySelectedOne() {
    if (this.editArray.length > 0) {
      this.editPopup = false;
    }
  }


  viewPopup: boolean = true;
  confirmViewRow() {
    console.log("ToBE Viewed:: ", this.currentItem);
    this.viewPopup = true;
  }

  closeViewPopup() {
    this.viewPopup = true;
  }

  openViewPopup(item: any, i: any) {
    this.currentItem = item;
    console.log("VIEW PAGE:: ", this.currentItem);
    this.viewPopup = false;
  }


  viewArray: any = [];
  ViewByCheckbox(itemV: any, i: any, e: any) {
    var checked = (e.target.checked);
    // console.log("View By Checkbox:: ",itemV);
    // console.log("View Array::" ,this.viewArray);
    // console.log("present in array : "+this.viewArray.includes(itemV),  " checked : "+ checked)
    if (checked == true && this.viewArray.includes(itemV) == false) {
      this.viewArray.push(itemV);
      this.currentItem = this.viewArray[(this.viewArray.length - 1)];
    }
    if (checked == false && this.viewArray.includes(itemV) == true) {
      this.viewArray.splice(this.viewArray.indexOf(itemV), 1)
    }
  }

  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      this.viewPopup = false;
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
    // console.log(this.deletearray)
  }

  deleteSelected() {
    if (this.selectedAll == false) {
      this.deletearray.forEach((el: any) => {
        // this.currentItem = el;
        // this.confirmDeleteRow();
        this.assetTable = this.assetTable.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.assetTable.forEach((el: any) => {
        this.assetTable = this.assetTable.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }


  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.assetTable;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }


  //Ad info popup
  openDialog() {
    this.dialog.open(AdInfoComponent);
  }

  info: boolean = false;
  showDetail() {
    this.info = true;
  }
  hideDetail() {
    this.info = false;
  }

  // @ViewChild('videoElement') videoElement = {} as ElementRef<any>;
  videoElement: any;
  toDownload() {
    // this.dropDown.downloadFile().subscribe((res: any) => {
    //   console.log(res);
    //   this.videoElement.nativeElement.src = URL.createObjectURL(res);
    // })

    // this.dropDown.downloadFile().subscribe(
    //   (result: any) => {
    //     this.videoElement.nativeElement.src = URL.createObjectURL(result);
    //     this.videoElement.nativeElement.load();
    //   }
    // );

  }

  // @ViewChild('myCityDialog') cityDialog!: TemplateRef<any>;

  // curr: any
  // openTable(item: any) {
  //   this.dialog.open(this.cityDialog);
  //   this.assetService.getAsset().subscribe((res: any) => {
  //     console.log(res)
  //   })
  //   this.curr = item;
  //   // console.log(this.curr)
  // }
}
