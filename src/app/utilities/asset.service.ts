import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  assetUrl = 'http://usmgmt.iviscloud.net:777/ProximityAdvertisement/listAssets_1_0/?deviceId=123';

  constructor(private http: HttpClient) { }

  getAssets() {
    // let url = this.assetUrl;
    // let user = JSON.parse(localStorage.getItem('user')!);

    // let payload = {
    //   "deviceId": deviceId,
    //   "callingUsername": user.UserName,
    //   "accesstoken": user.access_token,
    //   "callingSystemDetail":"portal"
    // }

    return this.http.get(this.assetUrl);
  }

}
