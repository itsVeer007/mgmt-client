import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  baseUrl = 'http://54.92.215.87:943/businessInterface';

  constructor(private http: HttpClient, private storageSer: StorageService) { }

  listSites() {
    let user: any = this.storageSer.get('user');
    let url = this.baseUrl + '/sites/sitesList_2_0';
    let payload = {
      userName : user?.UserName,
      accessToken : 'abc',
      calling_System_Detail: "portal",
    }
    return this.http.post(url, payload);
  }

  getCamerasForSiteId(payload: any) {
    let url = `${this.baseUrl}/getCamerasForSiteId_1_0/${payload}`;
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

}
