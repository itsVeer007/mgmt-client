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
}
