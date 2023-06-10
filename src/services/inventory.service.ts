import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  baseUrl = 'http://192.168.0.119:8080';

  constructor(private http: HttpClient) { }

  getListing() {
    let url = this.baseUrl + "/listing_1_0";
    return this.http.get(url);
  }

  createInventory(payload: any) {
    let url = this.baseUrl + '/creating_1_0';
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
