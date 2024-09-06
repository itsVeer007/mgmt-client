import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  

  baseUrl = 'http://54.92.215.87:943';
  shoowMenu: any;
  // baseUrl = 'http://192.168.0.194:8000';

  constructor(private http: HttpClient, private storageSer: StorageService) { }

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
  


    baseUrlForCamera = 'http://rsmgmt.ivisecurity.com:8943'

  // getCamerasForSiteId(payload?: any) {
  //   console.log(payload)
  //   let url = this.baseUrlForCamera + '/camera/getCameraShortDetailsForSiteId_1_0';
  //   // let url = `http://192.168.0.127:8080/camera/getCameraFullDetailsForSiteId_1_0/${payload.siteId}`;
  //   let params = new HttpParams().set('siteId', payload);
  //   return this.http.get(url, {params:params});
  // }

  getCamerasForSiteId(payload: any) {
    console.log(payload)
    let url = `${this.baseUrl}/getCamerasForSiteId_1_0/${payload}`;
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
    // let user = JSON.parse(localStorage.getItem('user')!);
    console.log(payload)
    let url = `${this.baseUrl}/centralBox/addCentralBox_1_0`;
    return this.http.post(url, payload);
  }

  createCamera(payload: any){
    let url = `${this.baseUrl}/camera/addCamera_1_0`;
    return this.http.post(url, payload)
  }

  updateCamera(payload: any){
    let url = `${this.baseUrl}/camera/updateCameraData_1_0/${payload.cameraId}`;
    // let url = `http://192.168.0.127:8080/camera/updateCameraData_1_0/${payload.cameraId}`;
    return this.http.put(url, payload)
  }


  showDefenderDetails():Observable<any>{
    let url="http://192.168.0.232:7548/showDefenderDetails";
  
    return this.http.get(url);
  
  }
  
  addCamDetails(payload: any) {
    // let url = `${this.baseUrl}/centralBox/addCentralBox_1_0`;
    let url="http://192.168.0.232:7548/addDefenderCamDetails";
    return this.http.post(url, payload);
  }
  
  addRouterDetails(payload: any) {
    // let url = `${this.baseUrl}/centralBox/addCentralBox_1_0`;
    let url="http://192.168.0.232:7548/addDefenderCamDetails";
    return this.http.post(url, payload);
  }


  getSiteUserDetails(payload: any){
    // let url= `http://192.168.0.194:8000/userDetails/getUsersDetailsForSiteId_1_0/${payload.siteId}`;
    // let url= `${this.baseUrl}/userDetails/getUsersDetailsForSiteId_1_0/${payload.siteId}`;
    let url= `http://34.206.37.237:80/userDetails/getUsersDetailsForSiteId_1_0/${payload.siteId}`;
    
    return this.http.get(url);
  }



}
