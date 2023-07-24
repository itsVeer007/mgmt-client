import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductMasterService {

  constructor(private http: HttpClient) { }

  baseUrl = `${environment.baseUrl}/inventory`;
  // baseUrl = 'http://192.168.0.119:8080';

  mySub = new Subject();

  listProduct() {
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
    let url = this.baseUrl + `/deleteProduct_1_0/${payload.id}/${1}`;

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
