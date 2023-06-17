import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

    baseUrl= `${environment.baseUrl}/proximityads`;

  constructor(private http: HttpClient) { }

  listDeviceAdsInfo() {
    let url = this.baseUrl + '/listDeviceAdsInfo_1_0';
    return this.http.get(url);
  }

  listDeviceBySiteId(siteId: any) {
    let url = this.baseUrl + '/listDeviceAdsInfo_1_0';

    var payload = {
      'siteId': siteId
    }

    return this.http.get(url, {params: payload});
  }

  createDeviceandAdsInfo(payload: any) {
    let url = this.baseUrl + '/createDeviceandAdsInfo_1_0';
    return this.http.post(url, payload);
  }

  updateDeviceAdsInfo(payload: any) {
    let url = this.baseUrl + '/updateDeviceAdsInfo_1_0';
    return this.http.put(url, payload);
  }

  deleteDeviceAdsInfo(payload: any) {
    let url = this.baseUrl + '/deleteDeviceAdsInfo_1_0';

    let myObj = {
      'deviceId': payload,
      'modifiedBy': payload
    }
    return this.http.delete(url, {body: myObj})
  }

}
