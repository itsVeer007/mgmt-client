import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DatePipe, formatDate } from '@angular/common';

import { environment } from '../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  assets$ = new BehaviorSubject(null);

  constructor(private http: HttpClient, private date: DatePipe, private storageSer: StorageService) { }

  baseUrl = `${environment.adsAndInventoryUrl}/proximityads`;


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

  listAssets() {
    let url = this.baseUrl + "/listAssets_1_0";
    return this.http.get(url);
  }

  listAssets1(payload: any) {
    let url = this.baseUrl + "/listAssets_1_0";
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if(payload?.deviceId) {
      params = params.set('deviceId', payload?.deviceId);
    }

    return this.http.get(url, {params: params});
  }

  getAssetBySiteId(siteId: any) {
    let url = this.baseUrl + "/listAssets_1_0";

    let myObj = {
      'siteId': siteId
    };

    return this.http.get(url, { params: myObj });
  }

  getAssetByDevId(devId: any) {
    let url = this.baseUrl + "/listAssets_1_0";

    let myObj = {
      'deviceId': devId
    };

    return this.http.get(url, { params: myObj });
  }


  addAsset(payload: any, file: any) {
    let user = this.storageSer.get('user');
    // let deviceData = this.storageSer.get('add_body');
    let formData: any = new FormData();
    formData.append('file', file);

    let assetData = {
      'deviceId': payload?.asset?.deviceId,
      'deviceModeId': payload?.asset?.deviceModeId,
      'playOrder': payload?.asset?.playOrder,
      'createdBy': user?.UserId,
      'name': payload?.asset?.name,
      'splRuleId': payload?.asset?.splRuleId,
      'fromDate': payload?.asset?.fromDate ? formatDate(payload?.asset?.fromDate, 'yyyy-MM-dd', 'en-us') : formatDate(new Date(), 'yyyy-MM-dd', 'en-us'),
      'toDate': payload?.asset?.toDate ? formatDate(payload?.asset?.toDate, 'yyyy-MM-dd', 'en-us') : '2999-12-31'
    }
    const assetBlob = new Blob([JSON.stringify(assetData)], {
      type: 'application/json',
    });
    formData.append('asset', assetBlob);

    let paramData = {
      'timeId': payload?.nameParams?.timeId,
      'tempId': payload?.nameParams?.tempId,
      'maleKids': payload?.nameParams?.maleKids,
      'femaleKids': payload?.nameParams?.femaleKids,
      'maleYouth': payload?.nameParams?.maleYouth,
      'femaleYouth': payload?.nameParams?.femaleYouth,
      'maleAdults': payload?.nameParams?.maleAdults,
      'femaleAdults': payload?.nameParams?.femaleAdults,
      'vehicles': payload?.nameParams?.vehicles,
      'persons': payload?.nameParams?.persons
    }
    const paramBlob = new Blob([JSON.stringify(paramData)], {
      type: 'application/json',
    });
    formData.append('nameParams', paramBlob);

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

  updateAssetStatus(payload: any) {
    let url = this.baseUrl + "/updateAssetStatus_1_0";
    let user = this.storageSer.get('user');
    let myObj = {
      'id': payload?.id,
      'status': (payload.status === 2 || payload.status === 4) ? 3 : (payload.status === 3 || payload.status === 5 ? 2 : null),
      'modifiedBy': user?.UserId
    }
    return this.http.put(url, myObj);
  }


  /* devices */
  listDeviceAdsInfo() {
    let url = this.baseUrl + '/listDeviceAdsInfo_1_0';
    return this.http.get(url);
  }

  listDeviceAdsInfo1(payload: any) {
    let url = this.baseUrl + "/listDeviceAdsInfo_1_0";
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if(payload?.deviceId) {
      params = params.set('deviceId', payload?.deviceId);
    }
    return this.http.get(url, {params: params});
  }

  listDeviceBySiteId(payload: any) {
    let url = this.baseUrl + '/listDeviceAdsInfo_1_0';
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    return this.http.get(url, {params: params});
  }

  listDeviceByDeviceId(deviceId: any) {
    let url = this.baseUrl + '/listDeviceAdsInfo_1_0';
    let params = new HttpParams().set('deviceId', deviceId)

    return this.http.get(url, {params: params});
  }

  updateRebootDevice(id: any) {
    let url = this.baseUrl + '/updateRebootDevice_1_0';
    const params = new HttpParams().set('deviceId', id.toString()).set('modifiedBy', 1);

    return this.http.put(url, null, { params: params });
  }

  createDeviceandAdsInfo(payload: any) {
    let url = this.baseUrl + '/createDeviceandAdsInfo_1_0';
    return this.http.post(url, payload);
  }

  updateDeviceAdsInfo(payload: any) {
    let url = this.baseUrl + '/updateDeviceAdsInfo_1_0';
    return this.http.put(url, payload);
  }

  deleteDeviceAdsInfo(payload: any) {
    let url = this.baseUrl + '/deleteDeviceAdsInfo_1_0';

    let myObj = {
      'deviceId': payload,
      'modifiedBy': payload
    }
    return this.http.delete(url, {body: myObj})
  }


  /* advertisement reports */
  reportUrl = 'http://192.168.0.137:8080';

  list() {
    let url = this.reportUrl + "/search";
    return this.http.get(url);

  }

  wifiList() {
    let url = this.reportUrl + "/connected_details";
    return this.http.get(url);
  }


  updateProductMaster(payload: any) {
    let url = this.reportUrl + '/updatingproduct_1_0';
    return this.http.put(url, payload)
  }

  deleteProduct(payload: any) {
    let url = this.reportUrl + `/deletion_1_0?Id=${payload.id}`;

    return this.http.delete(url);
  }


  filterReports(payload: any) {
    let url = this.reportUrl + '/search';
    let params = new HttpParams();

    if(payload.siteId) {
      params = params.set('siteId', payload.siteId)
    }
    if(payload.deviceId) {
      params = params.set('deviceId', payload.deviceId)
    }
    if(payload.from_date) {
      params = params.set('from_date', payload.from_date)
    }
    if(payload.to_date) {
      params = params.set('to_date', payload.to_date)
    }

    return this.http.get(url, {params: params})
  }


  filteBody(payload: any) {
    let url = this.reportUrl + `/getListBySearchPM_1_0?`;
    return this.http.get(url, {params: payload});
  }

  GetWifiStats(payload:any) {
    let url = this. baseUrl + `/wifiDetails/GetWifiStats_1_0`;
    let params = new HttpParams();
    if(payload?.time_connected) {
      params = params.set('time_connected', payload?.time_connected);
    }
    if(payload?.date) {
      params = params.set('date', payload?.date);
    }
    if(payload?.device_name) {
      params = params.set('device_name', payload?.device_name);
    }
    return this.http.get(url, {params: params});
  }

  GetWifiStats1(payload: any) {
    let url = this. baseUrl + `/wifiDetails/GetCurrentDayStats_1_0/${payload?.device_name}`;
    return this.http.get(url)
  }

  secondView(payload:any) {
    let url = this. baseUrl + '/wifiDetails/GetHourStats_1_0';
    let params = new HttpParams().set('time_connected',payload?.finalTime).set('device_name',payload.device)
    return this.http.get(url, {params:params})
  }


  dayWiseStats(payload?:any) {
    let url = this.baseUrl + '/dayWiseStats_1_0';
    let params = new HttpParams();
    if(payload?.device_name) {
      params = params.set('deviceName', payload?.device_name)
    }
    if(payload?.doif) {
      params = params.set('doif', formatDate(payload?.doif, 'yyyy-MM-dd','en-us' ))
    }
    if(payload?.doit) {
      params = params.set('doit', formatDate(payload?.doit, 'yyyy-MM-dd','en-us' ))
    }
    // if(payload?.page) {
    //   params= params.set('page',payload?.page)
    // }
    // if(payload?.pagesize) {
    //   params = params.set('pagesize',payload?.pagesize)
    // }
    if(payload?.siteId) {
      params = params.set('siteId',payload?.siteId)
    }
    return this.http.get(url, {params:params})
  }
 

  

  hourWiseStats(payload?:any) {
    let url = this.baseUrl + '/hourWiseStats_1_0';
    let params = new HttpParams();

    if(payload?.device_name) {
      params = params.set('deviceName',payload?.device_name)
    }
    if(payload?.date_connected) {
      params = params.set('doi', payload?.date_connected)
    }
    if(payload?.pagesize) {
      params = params.set('pagesize',payload?.pagesize)
    }
    if(payload?.page) {
      params= params.set('page',payload?.page)
    }

    return this.http.get(url,{params:params})
  }

  deviceWiseStats(payload?:any) {
    let url = this.baseUrl + '/deviceWiseStats_1_0';
    let params = new HttpParams();
    if(payload?.deviceName) {
      params = params.set('deviceName',payload?.deviceName)
    }
    if(payload?.doi) {
      // console.log(payload)
      params = params.set('doi', payload?.doi)
    }
    if(payload?.time_connected) {
      params = params.set('toi' ,payload?.time_connected)
    }
    if(payload?.pagesize) {
      params = params.set('pagesize',payload?.pagesize)
    }
    if(payload?.page) {
      params= params.set('page',payload?.page)
    }
    return this.http.get(url,{params:params});
  }

  getAnalytics(payload: any) {
    let date = formatDate(new Date(), 'yyyy-MM-dd', 'en-us');
    let url = this. baseUrl + `/getAnalytics_1_0/${payload?.device_name}/${date}`;
    return this.http.get(url)
  }


  getHealth(payload?: any): Observable<any> {
    let url = environment.baseUrl + '/deviceHealth/generateDeviceHealthstats_1_0';
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if(payload?.deviceId) {
      params = params.set('deviceId', payload?.deviceId);
    }
    return this.http.get(url, {params: params});
  }

  devicesStatus() {
    let url = environment.baseUrl + '/deviceHealth/deviceHealthStatusfromTunnel_1_0';
    return this.http.get(url);
  }
}
