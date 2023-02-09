import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  getAssetUrl = 'http://usmgmt.iviscloud.net:777/ProximityAdvertisement/listAssets_1_0/?deviceId=123';

  addAssetUrl = 'http://usmgmt.iviscloud.net:777/ProximityAdvertisement/createAsset_1_0/';

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

    return this.http.get(this.getAssetUrl);
  }

  addAsset(payload: any) {
    return this.http.post(this.addAssetUrl, payload)
  }

}
