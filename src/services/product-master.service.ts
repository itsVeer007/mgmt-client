import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductMasterService {

  constructor(private http: HttpClient) { }

  baseUrl = 'http://192.168.0.119:8080';

  mySub = new Subject();

  list() {
    let url = this.baseUrl + "/list_1_0";
    return this.http.get(url);
  }

  addingproduct(payload: any) {
    let url = this.baseUrl + '/addingproduct_1_0';
    return this.http.post(url, payload)
  }








  UpdateInventory(payload: any) {
    let url = this.baseUrl + '/updatingall_1_0';
    return this.http.put(url, payload)
  }

  deleteInventory(payload: any) {
    let url = this.baseUrl + `/deleting_1_0?productId=${payload.productId}`;

    return this.http.delete(url);
  }

  filteBody(payload: any) {
    let url = this.baseUrl + `/getListBySearch_1_0?`;

    let myObj = {
      productBrand: payload?.productBrand,
      status: payload?.status,
      productCategory: payload?.productCategory,
    }

    return this.http.get(url, {params: myObj});
  }
}
