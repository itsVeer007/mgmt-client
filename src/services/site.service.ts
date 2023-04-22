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
    return this.http.get(url)
  }

  getDevice() {
    let url = this.deviceUrl + '/listDeviceAdsInfo_1_0';
    return this.http.get(url)
  }

  addDevice(payload: any) {
    let url = this.deviceUrl + "/createDeviceandAdsInfo_1_0";
    return this.http.post(url, payload)
  }

  getEngineer(id: any) {
    let url = this.baseUrl + '/sites/getEngineerdetails_1_0/' + `${id}`;
    return this.http.get(url)
  }

  getCentralbox(id: any) {
    let url = this.baseUrl + '/sites/getcentralBox_1_0/' + `${id}`;
    return this.http.get(url)
  }
}
