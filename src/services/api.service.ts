import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  isLoggedin = new BehaviorSubject<boolean>(false);
  user$ = new BehaviorSubject<any>(null);
  error$ = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private router: Router) { }

  baseUrl = "http://usmgmt.iviscloud.net:777";

  login(payload: any) {
    // let loginData = this.user$.getValue();
    let url = this.baseUrl + "/businessInterface/login/login_2_0";
    return this.http.post(url, payload);
  }

  loginNew(payload: any) {
    let url  = `http://34.206.37.237/userDetails/user_login_1_0`;
    return this.http.post(url, payload);
  }

  logout() {
    localStorage.clear();
    localStorage.clear();
    this.isLoggedin.next(false);
    this.user$.next(null);
    this.router.navigate(['/login']);
  }

  getAuthStatus() {
    let user = JSON.parse(localStorage.getItem('user')!);
    if (user == null) {
      return false;
    }else{
      return true;
    }
  }

  autoLogout(timer: any) {
    setTimeout(() => {
      this.logout();
    }, timer)
  }

  onHTTPerror(e: any) {
    this.error$.next(e)
    this.router.navigateByUrl('/error-page');
  }

  refresh() {
    let url = this.baseUrl + '/businessInterface/login/refreshtoken';
    var user = JSON.parse(localStorage.getItem('user')!);
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
    var user = JSON.parse(localStorage.getItem('user')!);
    // console.log(user);
    payload.accesstoken = user.access_token;
    payload.callingUsername = user.UserName;
    return this.http.post(url, payload);
  }

  getUser(email: string) {
    let url = this.baseUrl+"/businessInterface/User/getUser_1_0";
    var user = JSON.parse(localStorage.getItem('user')!);
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
    var a = JSON.parse(localStorage.getItem('user')!);
    user.accesstoken = a.access_token;
    user.callingUsername = a.UserName;
    return this.http.post(url, user);
  }

}
