import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  baseUrl = 'http://usmgmt.iviscloud.net:777/ProximityAdvertisement/';

  constructor(private http: HttpClient) { }

  getAssets() {
    let url = this.baseUrl + "listAssets_1_0/";
    return this.http.get(url);
  }

  addAsset(payload: any) {
    let url = this.baseUrl + "createAsset_1_0/";
    return this.http.post(url, payload);
  }

}
