import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { MetadataService } from 'src/services/metadata.service';

@Component({
  selector: 'app-advertisements',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.css']
})
export class AdvertisementsComponent implements OnInit {

  constructor(
    private assetService: AssetService,
    private metadataSer: MetadataService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public alertSer: AlertService
  ) { }

  searchText!: string;
  showLoader: boolean = false;
  // currentDateTime: any;
  // endDateTime: any;

  siteData: any;
  ngOnInit() {
    this.siteData = JSON.parse(localStorage.getItem('siteIds')!);
    this.listAssets();
    this.listDevices();
  }

  advertisements: any = [];
  newAdvertisements: any = [];

  pending: any = [];
  added: any = [];
  sycedAfterAddition: any = [];
  sycedAfterRemoval: any = [];
  removed: any = [];

  listAssets() {
    this.showLoader = true;
    this.assetService.listAssets().subscribe((res: any) => {
      this.showLoader = false;
      this.advertisements = res.flatMap((item: any) => item.assets);
      this.newAdvertisements = this.advertisements;

      this.pending = [];
      this.added = [];
      this.sycedAfterAddition = [];
      this.sycedAfterRemoval = [];
      this.removed = [];
      for(let item of this.newAdvertisements) {
        if(item.status == 1) {
          this.pending.push(item);
        }
        if(item.status == 2) {
          this.added.push(item);
        }
        if(item.status == 4) {
          this.sycedAfterAddition.push(item);
        }
        if(item.status == 5) {
          this.sycedAfterRemoval.push(item);
        }
        if(item.status == 3) {
          this.removed.push(item);
        }
      }
    })
  }

  deviceData: any;
  listDevices() {
    this.assetService.listDeviceAdsInfo().subscribe((res: any) => {
      this.deviceData = res.flatMap((item: any) => item.adsDevices);
      this.filteredDevices = this.deviceData;
    })
  }

  /* searches */

  siteSearch: any;
  searchSites(event: any) {
    this.siteSearch = (event.target as HTMLInputElement).value
  }

  deviceSearch: any;
  searchDevices(event: any) {
    this.deviceSearch = (event.target as HTMLInputElement).value
  }

  filterObj = {
    siteId: null,
    deviceId: null,
  }

  filteredDevices: any;
  filterAdvertisements() {
    this.showLoader = true;
    this.assetService.listAssets1(this.filterObj).subscribe((res: any) => {
      this.showLoader = false;
      this.newAdvertisements = res.flatMap((item: any) => item.assets);
      if(this.filterObj.siteId != null) {
        this.assetService.listDeviceBySiteId(this.filterObj.siteId).subscribe((res: any) => {
          this.filteredDevices = res.flatMap((item: any) => item.adsDevices);
        });
      }

      this.pending = [];
      this.added = [];
      this.sycedAfterAddition = [];
      this.sycedAfterRemoval = [];
      this.removed = [];
      for(let item of this.newAdvertisements) {
        if(item.status == 1) {
          this.pending.push(item);
        }
        if(item.status == 2) {
          this.added.push(item);
        }
        if(item.status == 4) {
          this.sycedAfterAddition.push(item);
        }
        if(item.status == 5) {
          this.sycedAfterRemoval.push(item);
        }
        if(item.status == 3) {
          this.removed.push(item);
        }
      }
    })
  }

  deviceType: any;
  getMetadataByType(type: any) {
    this.metadataSer.getMetadataByType(type).subscribe((res: any) => {
      this.deviceType = res[0]?.metadata;
    });
  }


  showAsset: boolean = false;
  addErr: any = null;
  showAddAsset(siteId: any, deviceId: any) {
    if(siteId == '' && deviceId == '') {
      this.alertSer.error('Please select site and device to create advertisement');
    } else {
      this.showAsset = true;
      let addBody = {
        'siteId': siteId,
        'deviceId': deviceId
      }
      localStorage.setItem('add_body', JSON.stringify(addBody));
    }
  }

  closenow(type: String) {
    if (type == 'asset') {
      this.showAsset = false;
    }
  }


  /* Edit Asset Status */

  @ViewChild('editStatusDialog') editStatus = {} as TemplateRef<any>;

  currentStatusId: any
  openEditStatus(id: any) {
    this.currentStatusId = id;
    this.dialog.open(this.editStatus);
  }

  statusObj = {
    status: null,
    modifiedBy: 1
  }

  changeAssetStatus() {
    this.assetService.updateAssetStatus(this.currentStatusId, this.statusObj).subscribe((res: any) => {
      // console.log(res);
      this.listAssets();
      this.alertSer.snackSuccess(res?.message);
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }


  /* add actions */

  @ViewChild('editAssetDialog') editAssetDialog = {} as TemplateRef<any>;

  deviceMode: any;
  addStatus: any;
  openEditPopupp(item: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.metadataSer.getMetadataByType('Device_Mode').subscribe((res: any) => {
      this.deviceMode = res[0]?.metadata;
    });
    this.metadataSer.getMetadataByType('Asset_Status').subscribe((res: any) => {
      this.addStatus = res[0]?.metadata;
    });

    this.dialog.open(this.editAssetDialog);
    // console.log(item);
  }

  originalObject: any;
  changedKeys: any[] = [];
  currentItem: any;

  onDateChange(e: any) {
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

    let x = e.targetElement.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onSelectChange(event: any) {
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

    let x = event.source.ngControl.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }

    // console.log(this.changedKeys);
  }

  onInputChange(event: any) {
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

    // console.log(this.changedKeys);
  }

  confirmEditRow() {
    this.originalObject.fromDate = this.datepipe.transform(this.currentItem.fromDate, 'yyyy-MM-dd');
    this.originalObject.toDate = this.datepipe.transform(this.currentItem.toDate, 'yyyy-MM-dd');

    this.assetService.modifyAssetForDevice({asset: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      // console.log(res);
      this.alertSer.snackSuccess(res?.message);
    }, (err: any) => {
        this.alertSer.wait();
    })
  }

  @ViewChild('deleteAssetDialog') deleteAssetDialog = {} as TemplateRef<any>;

  deleteRow: any;
  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteAssetDialog);
  }

  deleteRow1(item: any, i: any) {
    // console.log(item);
    setTimeout(() => {
      this.advertisements.splice(i, 1);
    }, 1000);
  }

  confirmDeleteRow() {
    // console.log(this.currentItem);
    // this.assetTable = this.assetTable.filter((item: any) => item.siteId !== this.currentItem.siteId);
  }



  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.newAdvertisements;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}
