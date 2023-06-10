import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

    baseUrl= 'http://usstaging.ivisecurity.com:777/proximityads';

  constructor(private http: HttpClient) { }

  // getSitesList() {
  //   let url = this.baseUrl + '/sitesByCustomer_1_0?customerId=4602';
  //   return this.http.get(url);
  // }

  // getAdsDevicesBySite(id: any) {
  //   let url = this.baseUrl + "/adsDevicesBySite_1_0?siteId=" + `${id}`;
  //   return this.http.get(url);
  // }

  // getAssetsByDevice(deviceId: any) {
  //   let url = this.baseUrl + "/assetsByDevice_1_0?deviceId=" + `${deviceId}`;
  //   return this.http.get(url);
  // }

  listDeviceAdsInfo() {
    let url = this.baseUrl + '/listDeviceAdsInfo_1_0';
    return this.http.get(url);
  }

  getDevice(id: any) {
    let url = this.baseUrl + '/listDeviceAdsInfo_1_0';

    var payload = {
      'siteId': id
    }

    return this.http.get(url, {params: payload});
  }

  // listDevice(siteId: any) {
  //   let url = this.baseUrl + '/listDeviceAdsInfo_1_0';

  //   let myObj = {
  //     deviceId: siteId
  //   };

  //   return this.http.get(url, { params: myObj });
  // }

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
