import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductMasterService {

  mySub = new Subject();

  constructor(private http: HttpClient) { }

  // baseUrl = `${environment.baseUrl}/inventory`;
  baseUrl = 'http://192.168.0.137:8080';


  listProduct() {
    let url = this.baseUrl + "/listProducts_1_0";
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


  filteBody(payload: any) {
    let url = this.baseUrl + `/listProduct_1_0`;
    // let myObj = {
    //   'categoryId': payload.categoryId ? payload.categoryId : -1,
    //   'typeId': payload.typeId ? payload.typeId : -1,
    //   'statusId': payload.statusId ? payload.statusId : -1,
    //   'startDate': payload.startDate ? payload.startDate : '',
    //   'endDate': payload.endDate ? payload.endDate : '',
    //   'vendorId': payload.vendorId ? payload.vendorId : ''
    // }

    let params = new HttpParams();

    if (payload.categoryId) {
      params = params.set('categoryId', payload.categoryId);
    }
    if (payload.typeId) {
      params = params.set('typeId', payload.typeId);
    }
    if (payload.statusId) {
      params = params.set('statusId', payload.statusId);
    }
    if (payload.startDate) {
      params = params.set('startDate', payload.startDate);
    }
    if (payload.endDate) {
      params = params.set('endDate', payload.endDate);
    }
    if (payload.vendorId) {
      params = params.set('vendorId', payload.vendorId);
    }

    return this.http.get(url, {params: params});
  }
}
