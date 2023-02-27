import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  baseUrl = 'http://usstaging.ivisecurity.com:777/Mgmt_server-main';

  constructor(private http: HttpClient) { }

  getSites() {
    let url = this.baseUrl + '/sites/listSites_1_0';
    return this.http.get(url)
  }

  getEngineer(id: any) {
    let url = this.baseUrl + '/sites/getEngineerdetails_1_0/' + `${id}`;
    return this.http.get(url)
  }
}
