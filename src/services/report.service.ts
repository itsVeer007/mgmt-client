import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  baseUrl = 'http://192.168.0.175:8000';
  naik = 'http://192.168.0.120:8000'

  list() {
    let url = this.baseUrl + "/search";
    return this.http.get(url);

  }

  wifiList() {
    let url = this.naik + "/connected_details";
    return this.http.get(url);
  }


  updateProductMaster(payload: any) {
    let url = this.baseUrl + '/updatingproduct_1_0';
    return this.http.put(url, payload)
  }

  deleteProduct(payload: any) {
    let url = this.baseUrl + `/deletion_1_0?Id=${payload.id}`;

    return this.http.delete(url);
  }


  filterReports(payload: any) {
    let url = this.baseUrl + '/search';
    let params = new HttpParams();

    if(payload.siteId) {
      params = params.set('siteId', payload.siteId)
    }
    if(payload.deviceId) {
      params = params.set('deviceId', payload.deviceId)
    }
    if(payload.from_date) {
      params = params.set('from_date', payload.from_date)
    }
    if(payload.to_date) {
      params = params.set('to_date', payload.to_date)
    }

    return this.http.get(url, {params: params})
  }








  ////////////////////

  filteBody(payload: any) {
    let url = this.baseUrl + `/getListBySearchPM_1_0?`;

    // let myObj = {
    //   'productBrand': payload?.productCategoryId,
    //   'status': payload?.productTypeId,
    //   'productCategory': payload?.productStatusId,
    // }

    return this.http.get(url, {params: payload});
  }

}
