import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  baseUrl = 'http://usstaging.ivisecurity.com:777/proximityads';

  newUrl = 'http://192.168.0.115:8080/listOfInventories';

  constructor(private http: HttpClient, private date: DatePipe) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    })
  }

  get() {
    return this.http.get(this.newUrl);
  }

  getAssets() {
    let url = this.baseUrl + "/listAssets_1_0";
    return this.http.get(url);
  }


  addAsset(payload: any, file: any) {
    let formData: any = new FormData();

    // formData.append('siteId', payload.siteId);
    formData.append('file', file  );
    //formData.append('mimeType', payload.mimeType);

    let test = {
      'adsDeviceId': payload.asset.adsDeviceId,
      'deviceModeId': payload.asset.deviceModeId,
      'playOrder': payload.asset.playOrder,
      'createdBy': payload.asset.createdBy
    }

    const blobOverrides = new Blob([JSON.stringify(test)], {
      type: 'application/json',
    });

    formData.append('asset', blobOverrides);


    // formData.append('adsDeviceId', payload.adsDeviceId);
    // formData.append('deviceModeId', payload.deviceModeId);
    // formData.append('playOrder', payload.playOrder);
    // formData.append('createdBy', payload.createdBy);
    // formData.append('assetName', payload.assetName);

    // formData.append('startDate', this.date.transform(payload.startDate, 'yyyy-MM-dd'));
    // formData.append('endDate', this.date.transform(payload.endDate, 'yyyy-MM-dd'));

    // formData.append('enabled', payload.enabled);
    // formData.append('description', payload.description);

    let url = this.baseUrl + "/createAssetforDevice_1_0";
    return this.http.post(url, formData);
  }

  createDeviceAdd(payload: any) {
    let url = this.baseUrl + '/createDeviceAdsInfo_1_0';
    return this.http.post(url, payload)
  }

}
