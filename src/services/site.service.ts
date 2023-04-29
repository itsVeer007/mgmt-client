import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  baseUrl = 'http://usstaging.ivisecurity.com:777/Mgmt_server-main';

  deviceUrl= 'http://usstaging.ivisecurity.com:777/proximityads';

  constructor(private http: HttpClient) { }

  getSites() {
    let url = this.baseUrl + '/sites/listSites_1_0';
    return this.http.get(url);
  }

  getEngineer(id: any) {
    let url = this.baseUrl + '/sites/getEngineerdetails_1_0/' + `${id}`;
    return this.http.get(url);
  }

  getCentralbox(id: any) {
    let url = this.baseUrl + '/sites/getcentralBox_1_0/' + `${id}`;
    return this.http.get(url);
  }


  //device service

  getDeviceList() {
    let url = this.deviceUrl + '/listDeviceAdsInfo_1_0';
    return this.http.get(url);
  }

  addDevice(payload: any) {
    let url = this.deviceUrl + '/createDeviceandAdsInfo_1_0';
    return this.http.post(url, payload);
  }

  getDevice(deviceId: string) {
    var payload = {
      "deviceId": deviceId,
    }

    let url = this.deviceUrl + '/listDeviceAdsInfo_1_0';
    return this.http.post(url, payload);
  }

  updateDevice(payload: any, devId: any) {
    let data = {
      "deviceId": devId
    }

    let url = this.deviceUrl + '/updateDeviceAdsInfo_1_0';
    return this.http.put(url, data);
  }

}
