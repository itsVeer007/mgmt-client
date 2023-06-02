import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, HostListener, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeviceService } from 'src/services/device.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { AssetService } from '../../services/asset.service';
import { AdInfoComponent } from './ad-info/ad-info.component';
import { MatTabGroup } from '@angular/material/tabs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsComponent implements OnInit {
  @ViewChild("tabgroup", { static: true }) tabGroup!: MatTabGroup ;


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
  // inputToAdinfo: any;

  pending: any = [];
  added: any = [];
  removed: any = [];
  synced: any = [];
  sendToController: any = [];

  constructor(
    private http: HttpClient,
    private assetService: AssetService,
    private dropDown: MetadataService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private devSercice: DeviceService,
    private siteService: SiteService,
    public cdr:ChangeDetectorRef
  ) { }

  currentDateTime: any;
  endDateTime: any;
  devDevId: any
  ngOnInit(): void {
    this.currentDateTime =this.datepipe.transform(new Date().toLocaleString('en-us',{month:'short', day: 'numeric', year:'numeric'}));
    this.endDateTime =this.datepipe.transform(new Date('9999-12-31').toLocaleString('en-us',{month:'short', day: 'numeric', year:'numeric'}));
    this.getSiteData();
    this.getAssetData();
    this.ongetDeviceMode();
    // this.openTable();
    // this.getAssets();

    this.devDevId = JSON.parse(localStorage.getItem('device_temp')!);
  }


  assetTable: any = [];
  inputToAddAsset: any;
  tableData: any;
  siteMap: any
  siteIdToTable: any;

  deviceIds: any = [];
  newTableData: any = [];

  // myFun() {
    // this.newTableData = [];
    // this.assetMsg = '';
    // this.cdr.detectChanges();
  // }

  assetMsg: string = '';
  getSiteData() {
    this.devSercice.listDeviceAdsInfo().subscribe((res: any) => {
      console.log(res);
      this.siteMap = res.sort((a: any, b: any) => a.siteId < b.siteId ? -1 : a.siteId > b.siteId ? 1 : 0);
      this.siteIdToTable = this.siteMap.flatMap((item: any) => item.siteId);
      // console.log(this.siteIdToTable);
      this.tableData = this.siteIdToTable;
      this.cdr.detectChanges();
    })
  }



  x: any
  getAssetData() {
    this.showLoader = true;
    this.assetService.getAssets().subscribe((res: any) => {
      console.log('res', res);
      this.showLoader = false;

      this.inputToAddAsset = res;
      const assets = res.flatMap((item: any) => item.assets);
      // console.log(assets);

      this.assetTable = assets;
      // this.tableData = this.assetTable;

      /* status count */
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
    });
    this.cdr.detectChanges();
  }

  getAssetss(e: any) {
    // console.log(e);

    var selectedId = e?.tab?.textLabel;
    this.assetMsg = '';
    this.cdr.detectChanges();
    this.newTableData = [];
    this.assetService.getAsset(selectedId).subscribe((res: any) => {
      // console.log(res);

      if(res == undefined || res.length == 0) {
        this.newTableData = [];
        this.assetMsg = 'No assets';
        this.cdr.detectChanges();
      }
      else {
        this.newTableData = res[0]?.assets;
        this.x = this.newTableData;
        this.assetMsg = '';
        this.cdr.detectChanges();
      }
      console.log(this.newTableData);

    })
  }


  siteSearch: any;
  searchForSiteInput(e: any) {
    this.siteSearch = (e.target as HTMLInputElement).value;
    console.log(this.siteSearch);
  }

  searchForSiteOption(data: any) {
    let dataSome = this.tableData;
    this.siteIdToTable = dataSome.filter((el: any) => el == data);
  }

  deviceSearch: any;
  deviceForSiteInput(e: any) {
    this.deviceSearch = (e.target as HTMLInputElement).value;
  }

  deviceForSiteOption(data: any) {
    let dataSome = this.x;
    this.newTableData = dataSome.filter((el: any) => el.deviceId == data);
  }

  modeSearch: any;
  searchForModeInput(e: Event) {
    this.modeSearch = (e.target as HTMLInputElement).value;
  }

  searchForModeOption(data: any) {
    let dataSome = this.tableData;
    this.siteIdToTable = dataSome.filter((el: any) => el.deviceModeId == data);
  }


  deviceMode: any;
  assetStatus: any;
  ongetDeviceMode() {
    this.dropDown.getMetadata().subscribe((res: any) => {
      for(let item of res) {
        if(item.type == 'Device_Mode') {
          this.deviceMode = item.metadata;
        }
        else if(item.type == 'Asset_Status') {
          this.assetStatus = item.metadata;
        }
      }
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

  showAddAsset(devData: any) {
    this.showAsset = true;
    // this.dialog.closeAll();
    localStorage.setItem('device_temp', JSON.stringify(devData));
  }

  closenow(value: any, type: String) {
    if (type == 'asset') { this.showAsset = value; }
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



    /* Edit Asset Status */

    @ViewChild('editStatusDialog') editStatus = {} as TemplateRef<any>;

    currentStatusId: any
    openEditStatus(id: any) {
      this.dialog.open(this.editStatus);
      this.currentStatusId = id;
      // console.log(id);
      // this.dialog.closeAll();
    }


    statusObj = {
      status: null,
      modifiedBy: 1
    }

    statusUpdate0: any;
    statusUpdate1: any;
    statusUpdate2: any;
    changeAssetStatus() {
      // this.dialog.closeAll();

      this.statusUpdate2 = Swal.fire({
        text: "Please wait",
        imageUrl: "assets/gif/ajax-loading-gif.gif",
        showConfirmButton: false,
        allowOutsideClick: false
      });

      this.assetService.updateAssetStatus(this.currentStatusId, this.statusObj).subscribe((res: any) => {
        console.log(res);
        console.log(this.currentStatusId);

        if(res.statusCode == 200) {
          this.statusUpdate1 = Swal.fire({
            icon: 'success',
            title: 'Done!',
            text: `${res.message}`,
            // timer: 3000,
            // buttons: false,
          });
        };

        setTimeout(() => {
          // window.location.reload();
        }, 3000);

      }, (err: any) => {
        console.log(err);
        if(err) {
          this.statusUpdate0 = Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: 'Updating Asset failed',
            // timer: 3000,
          });
        };
      });
    }


    /* View Asset */

    @ViewChild('viewAssetDialog') addAsset = {} as TemplateRef<any>;
    viewPopup: boolean = true;

    openViewPopup(item: any, i: any) {
      this.currentItem = item;
      this.dialog.open(this.addAsset);

      console.log("VIEW PAGE:: ", this.currentItem);
      // this.viewPopup = false;
    }

    confirmViewRow() {
      console.log("ToBE Viewed:: ", this.currentItem);
      this.viewPopup = true;
    }

    closeViewPopup() {
      this.viewPopup = true;
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
        // this.viewPopup = false;
        this.dialog.open(this.addAsset);
      }
    }



  /* Edit Asset */

  @ViewChild('editAssetDialog') editAsset = {} as TemplateRef<any>;
  editPopup: boolean = true;

  openEditPopupp(item: any, i: any) {
    this.dialog.open(this.editAsset);

    this.currentItem = JSON.parse(JSON.stringify(item));
    console.log(item);
  }



  originalObject: any;
  changedKeys: any[] = [];

  on(event: any) {
    let x = event.source.ngControl.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
      // this.originalObject[x] = Event.target.value;
    }
  }

  onDateChange(e: any) {
    // console.log(e.targetElement.name);
    let x = e.targetElement.name;
    this.changedKeys.push(x);
  }

  onChange(event: any) {
    this.originalObject = {
      "id": this.currentItem.id,
      "deviceModeId": this.currentItem.deviceModeId,
      "playOrder": this.currentItem.playOrder,
      "modifiedBy": 1,
      "fromDate": this.currentItem.fromDate,
      "toDate": this.currentItem.toDate,
      "active": this.currentItem.active,
      "status": this.currentItem.status
    };

    let x = event.target['name'];
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
      // this.originalObject[x] = event.target.value;
    }
    console.log(this.changedKeys);
    console.log(this.originalObject);
  }

  assetUpdate0: any;
  assetUpdate1: any;
  assetUpdate2: any;
  confirmEditRow() {
    this.assetUpdate2 = Swal.fire({
      text: "Please wait",
      imageUrl: "assets/gif/ajax-loading-gif.gif",
      showConfirmButton: false,
      allowOutsideClick: false
    });

    this.assetService.modifyAssetForDevice({asset: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      console.log(res);
      if(res) {
        this.assetUpdate1 = Swal.fire({
          icon: 'success',
          title: 'Done!',
          text: `${res.message}`,
        });
      }

      setTimeout(() => {
        // window.location.reload();
      }, 3000);

    }, (err: any) => {
      if(err) {
        this.assetUpdate0 = Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Updating asset failed',
          // timer: 3000,
        });
      };
    })
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
      // this.editPopup = false;
      this.dialog.open(this.editAsset);
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


  videoElement: any;
  toDownload(id: any) {
    this.assetService.download(id).subscribe((res: any) => {
      console.log(res);
      this.videoElement = res.url;
      // console.log(this.videoElement);
    })
  }

}
