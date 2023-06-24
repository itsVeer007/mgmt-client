import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  baseUrl = 'http://192.168.0.125:8000';

  naik = 'http://192.168.0.120:8000'

  list() {
    let url = this.baseUrl + "/search/119";
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
