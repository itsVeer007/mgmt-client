import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorsService {

  constructor(private http:HttpClient) { }

  baseUrl = `${environment.baseUrl}/inventory`;
  // baseUrl = 'http://192.168.0.119:8080';

  listVendors() {
    let url = this.baseUrl + '/listVendors_1_0';
    return this.http.get(url)
  }

  listVendorsById(vendorId: any) {
    let url = this.baseUrl + `/listProduct_1_0?vendorId=${1}&statusId=${1}`;
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

  deleteVendor(payload: any) {
    let url = this.baseUrl + `/deleteVendor_1_0/${payload.id}/${1}`;
    return this.http.delete(url);
  }
}
