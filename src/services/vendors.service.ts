import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VendorsService {

  constructor(private http:HttpClient) { }

  // baseUrl = `${environment.baseUrl}/inventoryMgmt`;
  baseUrl = 'http://192.168.0.172:8080';

  listVendors() {
    let url = this.baseUrl + '/listVendors_1_0';

    return this.http.get(url)
  }

  listVendorsById(vendorId: any) {
    let url = this.baseUrl + `/listProduct_1_0?vendorId=${vendorId}&statusId=1`;

    return this.http.get(url)
  }

  createVendors(payload: any) {
    let url = this.baseUrl + '/createVendor_1_0';

    return this.http.post(url, payload);
  }

  updatevendor(payload: any) {
    let url = this.baseUrl + '/updateVendor_1_0';

    return this.http.put(url, payload);
  }
}
