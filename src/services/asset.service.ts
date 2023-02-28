import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  baseUrl = 'http://usstaging.ivisecurity.com:777/ProximityAdvertisement/';

  deviceUrl = 'http://usstaging.ivisecurity.com:777/Mgmt_server-main';



  constructor(private http: HttpClient, private date: DatePipe) { }

  getAssets() {
    let url = this.baseUrl + "listAssets_1_0/";
    return this.http.get(url);
  }

  addAsset(payload: any, file: any) {
    let formData: any = new FormData();

    formData.append('file', file);
    formData.append('siteId', payload.siteId);
    formData.append('deviceId', payload.deviceId);
    formData.append('enabled', payload.enabled);
    formData.append('mimetype', payload.mimetype);
    formData.append('assetName', payload.assetName);
    formData.append('playOrder', payload.playOrder);
    formData.append('startDate', this.date.transform(payload.startDate, 'yyyy-MM-dd'));
    formData.append('endDate', this.date.transform(payload.endDate, 'yyyy-MM-dd'));
    formData.append('createdBy', payload.createdBy);
    formData.append('deviceMode', payload.deviceMode);
    formData.append('description', payload.description);

    let url = this.baseUrl + "createAsset_1_0/";
    return this.http.post(url, formData);
  }

  addDevice(payload: any) {
    let url = this.deviceUrl + "/devices/addDeviceToSite_1_0";
    return this.http.post(url, payload)
  }

}
