import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl = `${environment.baseUrl}/inventory`;
  // baseUrl = 'http://192.168.0.119:8080';

  constructor(private http: HttpClient) { }

  listOrders() {
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


  listOrderItems() {
    let url = this.baseUrl + "/listOrderItems_1_0";
    return this.http.get(url);
  }

  listOrderItemsById(id: any) {
    let url = this.baseUrl + "/listOrderItems_1_0";
    let myObj = {
      'orderId': id
    }
    return this.http.get(url, {params: myObj});
  }

  addItemToOrder(payload: any) {
    let url = this.baseUrl + '/addItemToOrder_1_0';
    return this.http.post(url, payload)
  }

  updateOrderItem(payload: any) {
    let url = this.baseUrl + '/updateOrderItem_1_0';
    let params = new HttpParams().set('id', payload.id).set('productQuantity', payload.productQuantity).set('by', payload.by);
    return this.http.put(url, null, {params: params})
  }

  deleteOrderItem(payload: any) {
    let url = this.baseUrl + `/deleteOrderItem_1_0/${payload.id}`;
    return this.http.delete(url);
  }
}
