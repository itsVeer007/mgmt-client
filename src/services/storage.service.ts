import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  current_sub: BehaviorSubject<any> = new BehaviorSubject(null);
  edit_sub: BehaviorSubject<any> = new BehaviorSubject({ data: {}, dropdownData: [], updateUrl: '', getUrl: '' });

  constructor(private http: HttpClient) { }

  getMetadataByType(data: any):any {
    let metaData: any = this.get('metaData');
    return metaData?.filter((item: any) => item.type === data);
  }

  getData(url: string, params?: string) {
    // let paramss = new HttpParams().set('userName', '');
    return this.http.get(`${environment.baseUrl}/${url}/${params}`);
  }

  updateData(url: string, payload: any, params?: string) {
    let finalUrl
    if(params) {
      finalUrl = `${environment.baseUrl}/${url}/${params}`;
    } else {
      finalUrl = `${environment.baseUrl}/${url}`;
    }

    if(url === 'camera/updateCameraData_1_0') {
      payload.videoServerName = payload.httpUrl;
    }
    return this.http.put(finalUrl, payload)
  }

  public set(name: any, data: any) {
    // let x = btoa(encodeURIComponent(JSON.stringify(data)));
    // localStorage.setItem(name, x);
    localStorage.setItem(name, JSON.stringify(data));
  }

  public get(data: any) {
    // let x: any = localStorage.getItem(data);
    // return JSON.parse(decodeURIComponent(atob(x)));
    return JSON.parse(localStorage.getItem(data)!);
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

}
