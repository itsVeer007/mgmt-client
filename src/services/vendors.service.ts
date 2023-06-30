import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VendorsService {

  constructor(private http:HttpClient) { }

  baseUrl = 'http://192.168.0.131:8080';

  getvendors() {
    let url = this.baseUrl+'/getvendors';
    return this.http.get(url)
  }

  createVendors(payload: any) {
    let url = this.baseUrl + '/createVendors';

    return this.http.post(url, payload);
  }

  updatevendor(payload: any) {
    let url = this.baseUrl + '/updatevendor';

    return this.http.put(url, payload);
  }
}
