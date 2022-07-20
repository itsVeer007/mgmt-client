import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  user$=new BehaviorSubject(null);
  
  constructor(
    private http: HttpClient
  ) { }

  baseUrl = "http://usmgmt.iviscloud.net:777/businessInterface/";
  
  addUser(payload: any) {
    let url = this.baseUrl+"User/addUser_1_0";
    return this.http.post(url, payload);
  }
  
  login(loginDetails: any) {
    let url = this.baseUrl+"/login/login_2_0";
    return this.http.post(url,loginDetails);
  }
}
