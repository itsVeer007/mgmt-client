import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndentService {

  constructor(private http: HttpClient) { }

  // baseUrl = `${environment.baseUrl}/inventoryMgmt`;
  baseUrl = 'http://192.168.0.119:8080';

  listIndent() {
    let url = this.baseUrl + "/listIndent_1_0";
    return this.http.get(url);
  }

  createIndent(payload: any) {
    let url = this.baseUrl + '/createIndent_1_0';
    return this.http.post(url, payload)
  }

  addComponent(payload: any) {
    let url = this.baseUrl + '/addComponent_1_0';
    return this.http.post(url, payload)
  }

  updateIndentStatus(payload: any) {
    let url = this.baseUrl + `/updateIndentStatus_1_0/${payload.id}/${payload.statusId}/${payload.updatedBy}/${payload.inventoryId}`;
    // let params = new HttpParams().set('id', payload.id).set('invoiceNo', payload.invoiceNo).set('by', payload.by).set('remarks', payload.remarks);
    return this.http.put(url, null);
  }

  deleteIndent(payload: any) {
    let url = this.baseUrl + `/deleteIndent_1_0/${payload.id}`;
    return this.http.delete(url);
  }

  replaceComponent(payload: any) {
    let url = this.baseUrl + `/replaceComponent_1_0`;
    let params = new HttpParams().set('oldInventoryId', payload.oldInventoryId).set('newInventoryId', payload.newInventoryId).set('replacedBy', payload.replacedBy);
    return this.http.put(url, null, {params: params});
  }

  filteBody(payload: any) {
    let url = this.baseUrl + `/listIndent_1_0`;
    return this.http.get(url, {params: payload});
  }
}
