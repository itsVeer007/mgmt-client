import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { formatDate } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


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

   baseUrl = environment.adsAndInventoryUrl;
   baseUrl1 = "http://192.168.0.169:1111";

//faq
   listIssueInfo(payload?: any) {
   

    let url = `${this.baseUrl1}/faq/listIssueInfo_v_2_0`;
    let params = new HttpParams();
    if(payload?.Category) {
      params = params.set('category', payload?.Category);
    }
    if(payload?.deviceId) {
      params = params.set('deviceId', payload?.deviceId);
    }
   
    if(payload?.subcategoryId) {
      params = params.set('subCategory', payload?.subcategoryId);
    }
   
    return this.http.get(url, {params: params})
   }
   createIssueForFaq(payload: any, file: any) {
    console.log(payload);
    let url = `${this.baseUrl1}/faq/createIssueForFaq_v_2_0`;
    let user = this.storageSer.get('user');

    let formData: any = new FormData();
    formData.append('attachment', file);
    let issueDetails = {
      'issueCategoryId': payload?.issueCategoryId,
      'issueSubCategoryId': payload?.issueSubCategoryId,
      
      'dateOfEffected': payload?.dateOfEffected ? formatDate(payload?.dateOfEffected, 'yyyy-MM-dd', 'en-us') : formatDate(new Date(), 'yyyy-MM-dd', 'en-us'),
      'issueName' :payload?.issueName,
      'issueDescription':payload?.issueDescription,
      'createdBy': user?.UserId,
      'remarks': payload?.remarks
    }
    formData.append('issueDetails', JSON.stringify(issueDetails));
    return this.http.post(url, formData);
  }

  category() {
    let url = 'http://usstaging.ivisecurity.com:8949/serviceHelpDesk/categoryList_1_0';
    return this.http.get(url);
  }

  updateIssue(payload:any) {
    let user = this.storageSer.get('user');
    let url = `${this.baseUrl1}/faq/updateIssue_v_2_0`;
    let params = new HttpParams();
    if(payload?.issueId) {
      params = params.set('issueId', payload?.issueId);
    }
    let formData: any = new FormData();
    let issueDetails = {
      'issueCategoryId': payload?.issueCategoryId,
      'issueSubCategoryId': payload?.issueSubCategoryId,
      'issueStatus': payload?.issueStatus,
      'dateOfEffected': payload?.dateOfEffected ? formatDate(payload?.dateOfEffected, 'yyyy-MM-dd', 'en-us') : formatDate(new Date(), 'yyyy-MM-dd', 'en-us'),
      'issueName' :payload?.issueName,
      'issueDescription':payload?.issueDescription,
      'createdBy': user?.UserId,
      'remarks': payload?.remarks
    }
    formData.append('issueDetails', JSON.stringify(issueDetails));



    return this.http.put(url, formData,{params:params})
   }


   delete(payload:any) {
    let url = `${this.baseUrl1}/faq/updateIssue_v_2_0`;
    let user = this.storageSer.get('user');
    let formData: any = new FormData();
   let issueDetails = {
    
    'issueStatus': 5
   }
   formData.append('issueDetails', JSON.stringify(issueDetails));
   let params = new HttpParams();
   if(payload?.issueId) {
     params = params.set('issueId', payload?.issueId);
   }
   return this.http.put(url, formData,{params:params})
  }

  listCommentsForIssueId(payload:any) {
    let user = this.storageSer.get('user');
    let url = `${this.baseUrl1}/faq/listCommentsForIssueId_v_2_0`;
    let params = new HttpParams();
    if(payload?.issueId) {
      params = params.set('issueId', payload?.issueId);
    }
    return this.http.get(url, {params:params})
  }
  listApproachesForIssueId(payload:any) {
    let user = this.storageSer.get('user');
    let url = `${this.baseUrl1}/faq/listapproachesForIssueId_v_2_0`;
    let params = new HttpParams();
    if(payload?.issueId) {
      params = params.set('issueId', payload?.issueId);
    }
    return this.http.get(url, {params:params})
  }
  


  addCommentForIssue(payload:any) {
    let url = `${this.baseUrl1}/faq/addCommentForIssue_v_2_0`;
    return this.http.post(url,payload)
   }
   addApproachForIssue(payload:any) {
    let url = `${this.baseUrl1}/faq/addapproachForIssue_v_2_0`;
    return this.http.post(url,payload)
   }

//faq


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


  emailUrl = environment.emailUrl;

  postMail(payload:any, file:any) {
    console.log(payload)
    let user = this.storageSer.get('user');
    let url = `${this.emailUrl}/generic/send_report_email_1_0`;

    let formData = new FormData();

    formData.append('recipientEmails',payload.recipientEmails),
    formData.append('Bcc', payload.Bcc ?? ''),
    formData.append('Cc', payload.Cc ?? ''),
    formData.append('name', payload.name),
    formData.append('subject', payload.subject),
    formData.append('body', payload.body),
    formData.append('fileName', payload.fileName),
    formData.append('footer', 'Thanks & regards.'),
    formData.append('createdBy', user?.UserId),
    formData.append('regardsFrom', payload.regardsFrom),
    formData.append('files', file);
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
     let url = `${this.baseUrl1}/faq/updateIssue_v_2_0`;
     let user = this.storageSer.get('user');
    let myObj = {
      issueId: payload?.issueId,
      issueStatus: 5
    }
    return this.http.delete(url, {body:myObj})
   }

   createRule(payload:any) {
    let url = this.baseUrl + '/proximity_ads/createRule_1_0';
    return this.http.post(url,payload)
   }


   getSitesData(payload?:any) {
    let url = this.emailUrl + '/generic/allSitesInfo_1_0';
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if(payload?.deviceId) {
      params = params.set('deviceId', payload?.deviceId);
    }
    if(payload?.timeZone) {
      params = params.set('timeZone', payload?.timeZone);
    }
    if(payload?.cameraId) {
      params = params.set('cameraId', payload?.cameraId);
    }
    return this.http.get(url, {params: params})
   }



}
