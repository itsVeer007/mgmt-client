import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  baseUrl = 'http://usstaging.ivisecurity.com:777/proximityads';

  constructor(private http: HttpClient, private date: DatePipe) { }

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'multipart/form-data'
  //   })
  // }

  // download(id: any) {
  //   let url = this.baseUrl + '/getAssetFile_1_0'

  //   let myObj = {
  //     'assetName': 'BS-C001.mp4',
  //     'deviceId': id,
  //   }
  //   return this.http.get(url, {params: myObj});
  // }

  getAssets() {
    let url = this.baseUrl + "/listAssets_1_0";
    return this.http.get(url);
  }

  getAssetByDevId(devId: any) {
    let url = this.baseUrl + "/listAssets_1_0";

    let myObj = {
      deviceId: devId
    };

    return this.http.get(url, { params: myObj });
  }

  getAssetBySiteId(siteId: any) {
    let url = this.baseUrl + "/listAssets_1_0";

    let myObj = {
      siteId: siteId
    };

    return this.http.get(url, { params: myObj });
  }


  addAsset(payload: any, file: any) {
    let formData: any = new FormData();

    formData.append('file', file);

    let assetData = {
      'deviceId': payload.asset.deviceId,
      'deviceModeId': payload.asset.deviceModeId,
      'playOrder': payload.asset.playOrder,
      'createdBy': payload.asset.createdBy,
      'name': payload.asset.name,
      'splRuleId': payload.asset.splRuleId
    }

    const ass = new Blob([JSON.stringify(assetData)], {
      type: 'application/json',
    });

    formData.append('asset', ass);


    let paramData = {
      'timeId': payload.nameParams.timeId,
      'tempId': payload.nameParams.tempId,
      'maleKids': payload.nameParams.maleKids,
      'femaleKids': payload.nameParams.femaleKids,
      'maleYouth': payload.nameParams.maleYouth,
      'femaleYouth': payload.nameParams.femaleYouth,
      'maleAdults': payload.nameParams.maleAdults,
      'femaleAdults': payload.nameParams.femaleAdults,
      'vehicles': payload.nameParams.vehicles,

      'persons': payload.nameParams.persons
    }

    const param = new Blob([JSON.stringify(paramData)], {
      type: 'application/json',
    });

    formData.append('nameParams', param);

    let url = this.baseUrl + "/createAssetforDevice_1_0";
    return this.http.post(url, formData);
  }

  // createDeviceAdd(payload: any) {
  //   let url = this.baseUrl + '/createDeviceAdsInfo_1_0';
  //   return this.http.post(url, payload)
  // }

  modifyAssetForDevice(payload: any) {
    let url = this.baseUrl + '/modifyAssetForDevice_1_0';
    return this.http.put(url, payload);
  }

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
