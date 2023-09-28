import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  user$ = new BehaviorSubject(null);

  constructor(private http: HttpClient, private router: Router) { }

  baseUrl = "http://usmgmt.iviscloud.net:777";

  login(payload: any) {
    // let loginData = this.user$.getValue();
    let url = this.baseUrl + "/businessInterface/login/login_2_0";
    return this.http.post(url, payload);
  }

  loginNew(payload: any) {
    let url  = `http://3.239.251.173:80/userDetails/user_login_1_0`;
    return this.http.post(url, payload);
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.user$.next(null);
    this.router.navigate(['/login']);
  }

  autoLogout(timer: any) {
    setTimeout(() => {
      this.logout();
    }, timer)
  }

  refresh() {
    let url = this.baseUrl + '/businessInterface/login/refreshtoken';
    var user = JSON.parse(sessionStorage.getItem('user')!);
    let payload = {
      userName: user.UserName,
      calling_System_Detail: "portal",
      refreshToken: user.refresh_token
    }

    // console.log("refresh: ", url, payload);

    return this.http.post(url, payload)
  }

  addUser(payload: any) {
    let url = this.baseUrl + "/businessInterface/User/addUser_1_0";
    var user = JSON.parse(sessionStorage.getItem('user')!);
    // console.log(user);
    payload.accesstoken = user.access_token;
    payload.callingUsername = user.UserName;
    return this.http.post(url, payload);
  }

  getUser(email: string) {
    let url = this.baseUrl+"/businessInterface/User/getUser_1_0";
    var user = JSON.parse(sessionStorage.getItem('user')!);
    // console.log(user);

    var payload = {
      "email": email,
      "callingUsername": user.UserName,
      "accesstoken": user.access_token,
      "callingSystemDetail":"portal"
    }
    return this.http.post(url, payload);
  }

  updateUser(user:any) {
    let url = this.baseUrl+"/businessInterface/User/getUser_1_0";
    var a = JSON.parse(sessionStorage.getItem('user')!);
    user.accesstoken = a.access_token;
    user.callingUsername = a.UserName;
    return this.http.post(url, user);
  }

}
