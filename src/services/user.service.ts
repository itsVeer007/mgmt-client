import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // isLoggedin = new BehaviorSubject<boolean>(false);
  user$ = new BehaviorSubject<any>(null);
  error$ = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private router: Router, private storageSer: StorageService) { }

  baseUrl = "http://34.206.37.237:80";
  // baseUrl = 'http://192.168.0.194:8000';

  login(payload: any) {
    let url = this.baseUrl + "/businessInterface/login/login_2_0";
    let loginBody = {
      userName: payload.userName,
      password: payload.password,
      calling_System_Detail: "portal"
    }
    return this.http.post(url, loginBody);
  }

  loginNew(payload: any) {
    let url  = this.baseUrl + `/userDetails/user_login_1_0`;
    return this.http.post(url, payload);
  }

  logout() {
    this.storageSer.clearData();
    this.storageSer.clearData();
    // this.isLoggedin.next(false);
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

  createUser(payload: any) {
    // let url = this.baseUrl + "/createUser_1_0";
    let url = `${this.baseUrl}/userDetails/createUser_1_0`;
    var user: any = this.storageSer.get('user');
    payload.createdBy = user.UserId;
    // payload.callingUsername = user.UserName;
    return this.http.post(url, payload);
  }

  getUserInfoForUserId(payload: any) {
    var user: any = this.storageSer.get('user');
    let url = `${this.baseUrl}/userDetails/getUserInfoForUserId_1_0/${payload?.userId}`;
    return this.http.get(url);
  }

  // getUserInfoForId(payload: any) {
  //   let url = `http://34.206.37.237/userDetails/getUserInfoForUserId_1_0/${payload}`;
  //   return this.http.get(url);
  // }

  updateUser(payload: any) {
    let url = `http://34.206.37.237/userDetails/updateUser_1_0/${payload?.userId}`;
    return this.http.put(url, payload);
  }

  applySitesMapping(payload: any){
    console.log(payload)
    let url ='http://34.206.37.237/userDetails/applySitesMapping_1_0';
    return this.http.post(url,payload);
  }

  // getSitesListforUser(payload: any) {
  //   var user: any = this.storageSer.get('user');
  //   let url = `${this.baseUrl}/getSitesListforUser_1_0/${payload?.userId}`;
  //   return this.http.get(url);
  // }

  getSitesListForUserName(payload: any) {
    // let url = `${this.baseUrl}/getSitesListForUserName_1_0`;
    let url = `http://54.92.215.87:943/getSitesListForUserName_1_0`;
    
    // let user = this.storageSer.get('user');
    let params = new HttpParams().set('userName', payload?.UserName);
    return this.http.get(url, {params: params});
  }
  
}
