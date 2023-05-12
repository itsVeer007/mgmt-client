import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

    deviceUrl= 'http://usstaging.ivisecurity.com:777/proximityads';

    // deviceUrl= 'http://192.168.0.135:8080';

  constructor(private http: HttpClient) { }

  // getSitesList() {
  //   let url = this.deviceUrl + '/sitesByCustomer_1_0?customerId=4602';
  //   return this.http.get(url);
  // }

  // getAdsDevicesBySite(id: any) {
  //   let url = this.deviceUrl + "/adsDevicesBySite_1_0?siteId=" + `${id}`;
  //   return this.http.get(url);
  // }

  // getAssetsByDevice(deviceId: any) {
  //   let url = this.deviceUrl + "/assetsByDevice_1_0?deviceId=" + `${deviceId}`;
  //   return this.http.get(url);
  // }

  getDeviceList() {
    let url = this.deviceUrl + '/listDeviceAdsInfo_1_0';
    return this.http.get(url);
  }

  addDevice(payload: any) {
    let url = this.deviceUrl + '/createDeviceandAdsInfo_1_0';
    return this.http.post(url, payload);
  }

  getDevice(deviceId: any) {
    var payload = {
      "siteId": deviceId
    }

    let url = this.deviceUrl + '/listDeviceAdsInfo_1_0';
    return this.http.get(url, {params: payload});
  }

  updateDevice(payload: any) {
    // let adsDevice = {
    //   "deviceId": devId,
    //   "deviceModeId": payload.deviceModeId,
    //   "modifiedBy": 1,
    //   "remarks": payload.remarks
    // }

    // let updProps = [
    //   "remarks"
    // ]

    let url = this.deviceUrl + '/updateDeviceAdsInfo_1_0';
    return this.http.put(url, payload);
  }

}
