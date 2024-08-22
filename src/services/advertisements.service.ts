import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { formatDate } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdvertisementsService {

  constructor(private http:HttpClient,
    private storageSer: StorageService
  ) { }

  public ruleForDevice: BehaviorSubject<any> = new BehaviorSubject('');

  public addIdSub: BehaviorSubject<any> = new BehaviorSubject('');
  public addNameSub: BehaviorSubject<any> = new BehaviorSubject('');

  public deviceId: BehaviorSubject<any> = new BehaviorSubject('');

  public itemName = new BehaviorSubject<string>('')

   baseUrl = 'http://192.168.0.107:8000';


   createDevice(payload:any) {
    let url = this.baseUrl + '/proximity_ads/createDevice_1_0';
    return this.http.post(url,payload)
   }

   listDeviceInfo(payload?: any) {
    let url = this.baseUrl + '/proximity_ads/listDeviceInfo_1_0';
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if(payload?.deviceId) {
      params = params.set('deviceId', payload?.deviceId);
    }
    // if(payload?.deviceType) {
    //   params = params.set('deviceType', payload?.deviceType);
    // }
    if(payload?.deviceTypeId) {
      params = params.set('deviceTypeId', payload?.deviceTypeId);
    }
   
    return this.http.get(url, {params: params})
   }

   updateDeviceInfo(payload:any) {
    let user = this.storageSer.get('user');
    let url = this.baseUrl + '/proximity_ads/updateDeviceInfo_1_0';
    return this.http.put(url, payload)
   }

   deleteDevice(payload:any) {
    let user = this.storageSer.get('user');
    let url = this.baseUrl + '/proximity_ads/deleteDevice_1_0';
    let myObj = {
      'deviceId': payload?.deviceId,
      'modifiedBy': user?.UserId
    }
    return this.http.delete(url, {body:myObj})
   }

   updateRebootDevice(id: any) {
    let url = this.baseUrl + '/proximity_ads/flipRebootDevice_1_0';
    const params = new HttpParams().set('deviceId', id.toString()).set('modifiedBy', 1);

    return this.http.put(url, null, { params: params });
  }



  createAd(payload: any, file: any) {
    console.log(payload);
    let url = this.baseUrl + "/proximity_ads/createAd_1_0";
    let user = this.storageSer.get('user');

    let formData: any = new FormData();
    formData.append('adFile', file);
    let assetData = {
      'deviceId': payload?.deviceId,
      'adName': payload?.adName,
      'fromDate': payload?.fromDate ? formatDate(payload?.fromDate, 'yyyy-MM-dd', 'en-us') : formatDate(new Date(), 'yyyy-MM-dd', 'en-us'),
      'toDate': payload?.toDate ? formatDate(payload?.toDate, 'yyyy-MM-dd', 'en-us') : '2999-12-31',
      'createdBy': user?.UserId,
      'remarks': payload?.remarks
    }
    formData.append('adDetails', JSON.stringify(assetData));
    return this.http.post(url, formData);
  }

  listAdsInfo(payload?: any) {
    let url = this.baseUrl + '/proximity_ads/listAdsAndRules_1_0';
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if(payload?.deviceId) {
      params = params.set('deviceId', payload?.deviceId);
    }
    if(payload?.fromDate) {
      params = params.set('fromDate', formatDate(payload?.fromDate, 'yyyy-MM-dd', 'en-us'));
    } 
    if(payload?.toDate) {
      params = params.set('toDate', formatDate(payload?.toDate, 'yyyy-MM-dd', 'en-us'));
    } 
    if(payload?.adName) {
      params = params.set('adName', payload?.adName);
    } 
    return this.http.get(url, {params: params})
   }

   updateAd(payload:any) {
    let user = this.storageSer.get('user');

    let url = this.baseUrl + '/proximity_ads/updateAd_1_0';
    return this.http.put(url, payload)
   }

   user:any
   deleteAd(payload:any) {
     let url = this.baseUrl + '/proximity_ads/deleteAd_1_0';
     let user = this.storageSer.get('user');
    let myObj = {
        adId: payload?.adId,
        modifiedBy: user?.UserId
    }
    return this.http.delete(url, {body:myObj})
   }

   createRule(payload:any) {
    let url = this.baseUrl + '/proximity_ads/createRule_1_0';
    return this.http.post(url,payload)
   }


}
