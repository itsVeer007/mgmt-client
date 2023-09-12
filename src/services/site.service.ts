import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  baseUrl = `${environment.baseUrl}/businessInterface/sites`;

  constructor(private http: HttpClient) { }

  listSites() {
    let user = JSON.parse(sessionStorage.getItem('user')!);

    let payload = {
      userName : user.UserName,
      accessToken : user.access_token,
      calling_System_Detail: "portal",
    }

    let url = this.baseUrl + '/sitesList_2_0';

    return this.http.post(url, payload);
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
