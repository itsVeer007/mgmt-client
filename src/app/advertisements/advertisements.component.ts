import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { DeviceService } from 'src/services/device.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';

@Component({
  selector: 'app-advertisements',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.css']
})
export class AdvertisementsComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private assetService: AssetService,
    private dropDown: MetadataService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private devSercice: DeviceService,
    private siteService: SiteService,
    public alertSer: AlertService
  ) { }

  searchText!: string;
  showLoader: boolean = false;
  currentDateTime: any;
  endDateTime: any;

  siteIds: any;


  myControl = new FormControl('');
  options: number[] = [4585, 9854, 6932];
  filteredOptions: number[] = [];
  ngOnInit(): void {
    this.siteIds = JSON.parse(localStorage.getItem('siteIds')!);

    this.listAssets();

    this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    )
    .subscribe(filteredNumbers => {
      this.filteredOptions = filteredNumbers;
    });;
  }

  _filter(value: number): number[] {
    const filterValue = value.toString().toLowerCase();

    return this.options.filter(option => option.toString().toLowerCase().includes(filterValue));
  }

  advertisementTable: any;
  newAdvertisementTable: any;

  listAssets() {
    this.assetService.listAssets().subscribe((res: any) => {
      this.advertisementTable = res.flatMap((item: any) => item.assets);
      this.newAdvertisementTable = this.advertisementTable;
      // console.log(this.newAdvertisementTable);
    })
  }

  siteId: any = 'All';
  deviceId: any = 'All';
  filterTable(data: any) {
    if(data == 'All') {
      this.newAdvertisementTable = this.newAdvertisementTable
    } else {
      this.assetService.getAssetBySiteId(data).subscribe((res: any) => {
        this.newAdvertisementTable = res.flatMap((item: any) => item.assets);
      });

      this.assetService.getAssetByDevId(data).subscribe((res: any) => {
        this.newAdvertisementTable = res.flatMap((item: any) => item.assets);
      });
    }
  }

  newDeviceId: any;
  filterSelection(data: any) {
    if(data == 'All') {
      this.newDeviceId = this.newDeviceId;
    } else {
      this.devSercice.listDeviceBySiteId(data).subscribe((res: any) => {
        this.deviceId = res.flatMap((item: any) => item.adsDevices);
        this.newDeviceId = this.deviceId;
      });
    }
  }



  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.newAdvertisementTable;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}
