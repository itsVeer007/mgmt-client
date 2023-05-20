import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  baseUrl = 'http://usstaging.ivisecurity.com:777/proximityads';

  // baseUrl = 'http://192.168.0.135:8080';

  constructor(private http: HttpClient, private date: DatePipe) { }

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'multipart/form-data'
  //   })
  // }

  getAssets() {
    let url = this.baseUrl + "/listAssets_1_0";
    return this.http.get(url);
  }

  getAsset(devId: any) {
    let url = this.baseUrl + "/listAssets_1_0";

    let myObj = {
      deviceId: devId
    };

    return this.http.get(url, { params: myObj });
  }


  addAsset(payload: any, file: any) {
    let formData: any = new FormData();

    // formData.append('siteId', payload.siteId);
    formData.append('file', file);
    //formData.append('mimeType', payload.mimeType);

    let assetData = {
      'deviceId': payload.asset.deviceId,
      'deviceModeId': payload.asset.deviceModeId,
      'playOrder': payload.asset.playOrder,
      'createdBy': payload.asset.createdBy,
      'name': payload.asset.name,
      'status': payload.asset.status,
      'splRuleId': 0
    }

    const ass = new Blob([JSON.stringify(assetData)], {
      type: 'application/json',
    });

    formData.append('asset', ass);

    let paramData = {
      'adsTimeId': payload.nameParams.adsTimeId,
      'adsTempId': payload.nameParams.adsTempId,
      'adsMaleCount': payload.nameParams.adsMaleCount,
      'adsFemaleCount': payload.nameParams.adsFemaleCount,
      'adsKidsCount': payload.nameParams.adsKidsCount,
      'adsYouthCount': payload.nameParams.adsYouthCount,
      'adsEldersCount': payload.nameParams.adsEldersCount
    }

    const param = new Blob([JSON.stringify(paramData)], {
      type: 'application/json',
    });

    formData.append('nameParams', param);


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

  // createDeviceAdd(payload: any) {
  //   let url = this.baseUrl + '/createDeviceAdsInfo_1_0';
  //   return this.http.post(url, payload)
  // }

  updateAssetStatus(id: any, payload: any) {
    let url = this.baseUrl + "/updateAssetStatus_1_0";

    let myObj = {
      'id': id,
      'status': payload.status,
      'modifiedBy': payload.modifiedBy
    }

    return this.http.put(url, myObj);
  }

}
