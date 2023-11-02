import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  baseUrl = `${environment.baseUrl}/common`;

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


  add(payload: any) {
    let url = this.baseUrl + '/addMetadataKeyValue_1_0'
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

  // tempRange() {
  //   let url = this.metadata + 'Temp_Range'
  //   return this.http.get(url);
  // }

  // ageRange() {
  //   let url = this.metadata + 'Age_Range'
  //   return this.http.get(url);
  // }

  // productType() {
  //   let url = this.metadata + 'Product_Type'
  //   return this.http.get(url);
  // }

  // productModel() {
  //   let url = this.metadata + 'Product_Model'
  //   return this.http.get(url);
  // }

  // jobCategory() {
  //   let url = this.metadata + 'Job_Category'
  //   return this.http.get(url);
  // }

  // productCategory() {
  //   let url = this.metadata + 'Product_Category'
  //   return this.http.get(url);
  // }

  // weatherApi() {
  //   let url = this.metadata + 'Weather_API_Key'
  //   return this.http.get(url);
  // }
}
