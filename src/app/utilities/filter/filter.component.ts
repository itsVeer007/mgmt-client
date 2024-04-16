import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AssetService } from 'src/services/asset.service';
import { InventoryService } from 'src/services/inventory.service';
import { SiteService } from 'src/services/site.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {

  @Input() filterType: any;

  @Output() loaderFromChild: any = new EventEmitter<boolean>(false);
  @Output() tableDataFromChild: any = new EventEmitter();
  @Output() searchFromChild: any = new EventEmitter();

  constructor(
    private siteSer: SiteService,
    private storageSer: SiteService,
    private assetSer: AssetService,
    private inventorySer: InventoryService,
  ) { }

  ngOnInit() {
    this.listSites();
  }

  searchText: any;
  sitesList: any = [];
  listSites() {
    this.siteSer.listSites().subscribe((res: any) => {
      if(res?.Status == 'Success') {
        this.listDevices();
        this.sitesList = res?.siteList?.sort((a: any, b: any) => a.siteid < b.siteid ? -1 : a.siteid > b.siteid ? 1 : 0);
      }
      }, (err: any) => {
    });
  }

  devicesList: any = [];
  listDevices() {
    this.assetSer.listDeviceAdsInfo().subscribe((res: any) => {
      this.devicesList = res.flatMap((item: any) => item.adsDevices);
    })
  }

  siteId: any =  'All';
  deviceId: any = 'All';
  status: any = 'All';
  // advertisements: any = [];
  // devices: any = [];
  filterWithSites(type: any) {
    let siteId: any;
    let deviceId: any;
    this.siteId == 'All' ? siteId = null : siteId = this.siteId;
    this.deviceId == 'All' ? deviceId = null : deviceId = this.deviceId;

    if(type === 'advertisements') {
      this.loaderFromChild.emit(true);
      this.assetSer.listAssets1({siteId: siteId, deviceId: deviceId}).subscribe((res: any) => {
        this.loaderFromChild.emit(false);
        let x = res.flatMap((item: any) => item.assets);
        let y  = x.sort((a: any, b: any) => a.deviceModeId > b.deviceModeId ? -1 : a.deviceModeId < b.deviceModeId ? 1 : 0);
        this.tableDataFromChild.emit(y);
        this.assetSer.listDeviceBySiteId({siteId: siteId}).subscribe((res: any) => {
          this.devicesList = res.flatMap((item: any) => item.adsDevices);
        });
      });
    }

    if(type === 'devices') {
      this.loaderFromChild.emit(true);
      this.assetSer.listDeviceAdsInfo1({siteId: siteId, deviceId: deviceId}).subscribe((res: any) => {
        this.loaderFromChild.emit(false);
        let x = res.flatMap((item: any) => item.adsDevices);
        this.tableDataFromChild.emit(x);
      })
    }

    if(type === 'sensors') {
      this.loaderFromChild.emit(true);
      this.inventorySer.getData({siteId:siteId, device_name: deviceId}).subscribe((res:any)=> {
        let x = res.flatMap((item:any)=> item);
        this.tableDataFromChild.emit(x);
      })
    }

    if(type === 'wifi') {
      this.loaderFromChild.emit(true);
      this.assetSer.dayWiseStats({siteId: siteId, device_name: deviceId}).subscribe((res: any) => {
        // console.log(res);
        this.loaderFromChild.emit(false);
        if(res.message === 'no data') {
          this.tableDataFromChild.emit(res.content);
        } else {
          this.tableDataFromChild.emit(res.content);
        }
      });
    }
  }

  siteSearch: any;
  searchSites(event: any) {
    this.siteSearch = (event.target as HTMLInputElement).value;
  }

  deviceSearch: any;
  searchDevices(event: any) {
    this.deviceSearch = (event.target as HTMLInputElement).value;
  }

  searchTableData() {
    this.searchFromChild.emit(this.searchText);
  }

}
