import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user$ = new BehaviorSubject<any>(null);
  error$ = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageSer: StorageService
  ) { }

  baseUrl = environment.authUrl;

  loginNew(payload: any) {
    let url  = this.baseUrl + `/userDetails/user_login_1_0`;
    return this.http.post(url, payload);
  }

  logout() {
    this.storageSer.clearData();
    this.storageSer.clearData();
    this.user$.next(null);
    this.router.navigate(['./login']);
  }

  getAuthStatus() {
    let user = this.storageSer.get('user');
    if (user == null) {
      return false;
    } else {
      return true;
    }
  }

  onHTTPerror(e: any) {
    this.error$.next(e)
    this.router.navigateByUrl('/error-page');
  }

  listUsers() {
    let url = this.baseUrl + '/userDetails/listUsers_1_0';
    return this.http.get(url);
  }

  listUsersByRole() {
    let url = this.baseUrl + '/listUsersByRole_1_0';
    let params = new HttpParams().set('roleId', 30);
    return this.http.get(url, {params: params});
  }

  createUser(payload: any) {
    let url = `${this.baseUrl}/userDetails/createUser_1_0`;
    var user: any = this.storageSer.get('user');
    payload.createdBy = user.UserId;
    return this.http.post(url, payload);
  }

  getUserInfoForUserId(payload: any) {
    var user: any = this.storageSer.get('user');
    let url = `${this.baseUrl}/userDetails/getUserInfoForUserId_1_0/${payload?.userId}`;
    return this.http.get(url);
  }

  updateUser(payload: any) {
    let url = `${this.baseUrl}/userDetails/updateUser_1_0/${payload?.userId}`;
    return this.http.put(url, payload);
  }

  applySitesMapping(payload: any){
    let url =`${this.baseUrl}/userDetails/applySitesMapping_1_0`;
    return this.http.post(url, payload);
  }

  getSiteUserDetails(payload: any){
    let url= `${this.baseUrl}/userDetails/getUsersDetailsForSiteId_1_0/${payload.siteId}`;
    return this.http.get(url);
  }

  // getSitesListforUser(payload: any) {
  //   var user: any = this.storageSer.get('user');
  //   let url = `${this.baseUrl}/getSitesListforUser_1_0/${payload?.userId}`;
  //   return this.http.get(url);
  // }

  // getSitesListForUserName(payload: any) {
  //   let url = `${this.baseUrl}/getSitesListForUserName_1_0`;
  //   let params = new HttpParams().set('userName', payload?.UserName);
  //   return this.http.get(url, {params: params});
  // }
  
}
