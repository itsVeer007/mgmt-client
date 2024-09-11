import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  
  constructor(private http: HttpClient) { }
  
  baseUrl = `${environment.baseUrl}/common`;

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
    return this.http.put(url, payload);
  }
}
