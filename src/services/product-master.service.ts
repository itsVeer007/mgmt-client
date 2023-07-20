import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductMasterService {

  constructor(private http: HttpClient) { }

  baseUrl = 'http://192.168.0.119:8080';
  // baseUrl = 'http://usstaging.ivisecurity.com:777/inventoryMgmt';

  mySub = new Subject();

  list() {
    let url = this.baseUrl + "/listProduct_1_0";

    return this.http.get(url);
  }

  addingproduct(payload: any) {
    let url = this.baseUrl + '/createProduct_1_0';

    return this.http.post(url, payload)
  }

  updateProductMaster(payload: any) {
    let url = this.baseUrl + '/updateProduct_1_0';

    return this.http.put(url, payload)
  }

  deleteProduct(payload: any) {
    let url = this.baseUrl + `/deleteproduct_1_0?Id=${payload.id}`;

    return this.http.delete(url);
  }

  listByVendor() {
    let url = this.baseUrl + "/listProduct_1_0";

    return this.http.get(url);
  }











  ////////////////////

  filteBody(payload: any) {
    let url = this.baseUrl + `/listProduct_1_0`;

    // let myObj = {
    //   'productBrand': payload?.productCategoryId,
    //   'status': payload?.productTypeId,
    //   'productCategory': payload?.productStatusId,
    // }

    return this.http.get(url, {params: payload});
  }
}
