import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  

  cameras_sub: BehaviorSubject<any> = new BehaviorSubject([]);
  
  constructor(private http: HttpClient, private storageSer: StorageService) { }
  
  baseUrl = environment.baseUrl;

  // listSites() {
  //   let user: any = this.storageSer.get('user');
  //   let url = this.baseUrl + '/sites/sitesList_2_0';
  //   let payload = {
  //     userName : user?.UserName,
  //     accessToken : 'abc',
  //     calling_System_Detail: "portal",
  //   }
  //   return this.http.post(url, payload);
  // }

  createSite(payload: any){
    let url = `${this.baseUrl}/site/addSite_1_0`;
    return this.http.post(url, payload)
  }


  getSitesListForUserName() {
    let url = `${this.baseUrl}/getSitesListForUserName_1_0`;
    
    let user = this.storageSer.get('user');
    let params = new HttpParams().set('userName', user?.UserName);
    return this.http.get(url, ({params: params}));
  }

  getSitesListForAssign(payload: any) {
    let url = `${this.baseUrl}/getSitesListForUserName_1_0`;
    let params = new HttpParams().set('userName', payload?.User_Name);
    return this.http.get(url, {params: params});
  }


  gettimeZones() {
    return this.http.get("assets/JSON/timezones.json");
  }

  getSiteFullDetails(payload:any) {
    let url =`${this.baseUrl}/sites/getSiteFullDetails_1_0/${payload.siteId}`;
    return this.http.get(url)
  }

  updateSiteDetails(payload:any) {
    let url =`${this.baseUrl}/sites/updateSiteDetails_1_0/${payload.siteId}`;
    return this.http.put(url,payload)
  }

  // getCamerasForSiteId(payload?: any) {
  //   console.log(payload)
  //   let url = this.baseUrlForCamera + '/camera/getCameraShortDetailsForSiteId_1_0';
  //   // let url = `http://192.168.0.127:8080/camera/getCameraFullDetailsForSiteId_1_0/${payload.siteId}`;
  //   let params = new HttpParams().set('siteId', payload);
  //   return this.http.get(url, {params:params});
  // }

  getCamerasForSiteId(cameraId: any) {
    let url = `${this.baseUrl}/getCamerasForSiteId_1_0/${cameraId}`;
    // let url = `http://192.168.0.218:8000/getCamerasForSiteId_1_0/${cameraId}`;
    return this.http.get(url);
  }

  getEngineer(id: any) {
    let url = this.baseUrl + '/sites/getEngineerdetails_1_0/' + `${id}`;
    return this.http.get(url);
  }

  getCentralbox(payload: any) {
    let url = `${this.baseUrl}/centralBox/getCentralBox_1_0/${payload.siteId}` ;
    return this.http.get(url);
  }
  
  addCentralBox(payload: any) {
    let url = `${this.baseUrl}/centralBox/addCentralBox_1_0`;
    let user = this.storageSer.get('user');
    payload.createdBy = user.UserId;
    return this.http.post(url, payload);
  }

  createCamera(payload: any){
    let url = `${this.baseUrl}/camera/addCamera_1_0`;
    // let url = `http://192.168.0.218:8000/camera/addCamera_1_0`;
    return this.http.post(url, payload)
  }

  updateCamera(payload: any){
    let url = `${this.baseUrl}/camera/updateCameraData_1_0/${payload.cameraId}`;
    // let url = `http://192.168.0.218:8000/camera/updateCameraData_1_0/${payload.cameraId}`;
    // delete payload.httpUrl;
    return this.http.put(url, payload)
  }

  showDefenderDetails():Observable<any>{
    let url= this.baseUrl + "/showDefenderDetails";
    return this.http.get(url);
  }
  
  addCamDetails(payload: any) {
    let url= this.baseUrl + "/addDefenderCamDetails";
    return this.http.post(url, payload);
  }
  
  addRouterDetails(payload: any) {
    let url= this.baseUrl + "/addDefenderCamDetails";
    return this.http.post(url, payload);
  }

}
