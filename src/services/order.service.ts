import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

    // baseUrl = `${environment.baseUrl}/inventoryMgmt`;
    baseUrl = 'http://192.168.0.172:8080';

  constructor(private http: HttpClient) { }

  listOrderItems() {
    let url = this.baseUrl + "/listOrders_1_0";

    return this.http.get(url);
  }

  createOrder(payload: any) {
    let url = this.baseUrl + '/createOrder_1_0';

    return this.http.post(url, payload)
  }

  updateOrder(payload: any) {
    let url = this.baseUrl + '/updateOrder_1_0';
    let params = new HttpParams().set('id', payload.id).set('invoiceNo', payload.invoiceNo).set('by', payload.by).set('remarks', payload.remarks);

    return this.http.put(url, null, {params: params})
  }

  deleteOrder(payload: any) {
    let url = this.baseUrl + `/deleteOrder_1_0/${payload.id}`;

    return this.http.delete(url);
  }

  filteBody(payload: any) {
    let url = this.baseUrl + `/listOrders_1_0`;

    return this.http.get(url, {params: payload});
  }
}
