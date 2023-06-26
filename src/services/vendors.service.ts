import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VendorsService {

  constructor(private http:HttpClient) { }

  baseUrl = 'http://192.168.0.115';

  getvendors() {
    let url = this.baseUrl+'/getvendors';
    return this.http.get(url)
  }
}
