import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  baseUrl = `${environment.baseUrl}/common`;
  // baseUrl = 'http://192.168.0.196:8081';

  constructor(private http: HttpClient) { }

  getMetadata() {
    let url = this.baseUrl + '/getValuesListByType_1_0';
    return this.http.get(url);
  }

  getMetadataByType(payload: any) {
    let url = this.baseUrl + '/getValuesListByType_1_0';
    let params = new HttpParams().set('type', payload);
    return this.http.get(url, {params: params});
  }

  listMetadataTypes() {
    let url = this.baseUrl + '/listMetadataTypes_1_0';
    return this.http.get(url);
  }

  addMetadataTypes(payload: any) {
    let url = this.baseUrl + '/addMetadataTypes_1_0';
    return this.http.post(url, payload);
  }

  add(payload: any) {
    let url = this.baseUrl + '/addMetadataKeyValue_1_0';
    return this.http.post(url, payload);
  }

  updateMetadataKeyValue(payload: any) {
    let url = this.baseUrl + '/updateMetadataKeyValue_1_0';
    // let myObj = {
    //   "type": payload,
    //   "keyId": payload,
    //   "value": payload,
    //   "modifiedBy": 1,
    //   "remarks": payload
    // }
    return this.http.put(url, payload);
  }
}
