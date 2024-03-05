import { HttpClient } from '@angular/common/http';
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

  baseUrl = "http://34.206.37.237:80/userDetails";

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
    let url  = this.baseUrl + `/user_login_1_0`;
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
    let url = this.baseUrl + '/listUsers_1_0';
    return this.http.get(url);
  }

  createUser(payload: any) {
    // let url = this.baseUrl + "/createUser_1_0";
    let url = `${this.baseUrl}/createUser_1_0`;
    var user: any = this.storageSer.get('user');
    payload.accesstoken = user.access_token;
    payload.callingUsername = user.UserName;
    return this.http.post(url, payload);
  }

  getUserInfoForUserId(payload: any) {
    var user: any = this.storageSer.get('user');
    let url = `${this.baseUrl}/getUserInfoForUserId_1_0/${payload?.userId}`;
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
  
}
