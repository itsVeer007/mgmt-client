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
  @Output() dateFromChild:any =new EventEmitter

  constructor(
    private siteSer: SiteService,
    private storageSer: SiteService,
    private assetSer: AssetService,
    private inventorySer: InventoryService,
  ) { }

  ngOnInit() {
    this.getSitesListForUserName();
  }

  searchText: any;
  sitesList: any = [];
  getSitesListForUserName() {
    this.siteSer.getSitesListForUserName().subscribe((res: any) => {
      // console.log(res)
      if(res?.Status == 'Success') {
        this.listDevices();
        this.sitesList = res.sites.sort((a: any, b: any) => a.siteId < b.siteId ? -1 : a.siteId > b.siteId ? 1 : 0);
      }
      }, (err: any) => {
    });
  }

   siteIdToFind = 36319;

  devicesList: any = [];
  listDevices() {
    this.assetSer.listDeviceAdsInfo().subscribe((res: any) => {
      // console.log(res);
      this.devicesList = res.flatMap((item: any) => item.adsDevices);
    })
  }





  ticketStatusObj = {
    doif:null,
    doit:null,

  }

  // showFilter:boolean = true

  // applyFilter() {
  //   this.assetSer.dayWiseStats(this.ticketStatusObj).subscribe((res:any)=> {
  //     console.log(res);
  //   })
  // }

  siteId: any =  'All';
  deviceId: any = 'All';
  status: any = 'All';
  // advertisements: any = [];
  // devices: any = [];
  filterWithSites(type: any) {
    let doif: any = this.ticketStatusObj.doif;
    let doit: any = this.ticketStatusObj.doit; 
    let siteId: any;
    let deviceId: any;
    this.siteId == 'All' ? siteId = null : siteId = this.siteId;
    this.deviceId == 'All' ? deviceId = null : deviceId = this.deviceId;

    if(type === 'advertisements' || type === 'wifi') {
      this.loaderFromChild.emit(true);
      this.assetSer.listAssets1({siteId: siteId, deviceId: deviceId}).subscribe((res: any) => {
        // console.log(res)
        this.loaderFromChild.emit(false);
        let x = res.flatMap((item: any) => item.assets);
        let y  = x.sort((a: any, b: any) => a.deviceModeId > b.deviceModeId ? -1 : a.deviceModeId < b.deviceModeId ? 1 : 0);
        if(type === 'advertisements') {
          this.tableDataFromChild.emit(y);
        }
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
      this.assetSer.dayWiseStats({siteId: siteId, device_name: deviceId, doif:doif, doit:doit}).subscribe((res: any) => {
        // let x = res.flatMap((item:any)=> item);
        this.ticketStatusObj.doif = null;
        this.ticketStatusObj.doit = null;
        this.loaderFromChild.emit(false);
        this.tableDataFromChild.emit(res.content);
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
