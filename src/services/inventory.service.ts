import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  baseUrl = 'http://192.168.0.172:8080';
  // baseUrl = `${environment.baseUrl}/inventoryMgmt`;

  constructor(private http: HttpClient, public datepipe: DatePipe) { }

  getListing() {
    let url = this.baseUrl + "/listInventory_1_0";
    return this.http.get(url);
  }

  getWarranty(id: any) {
    let url = this.baseUrl + `/listWarranty_1_0/${id}`;
    return this.http.get(url);
  }

  createInventory(payload: any, condition: any) {
    let url = this.baseUrl + '/createInventoryAndWarranty_1_0';
    let payload1;
    let payload2;
    let payload3;
    if(condition == 'Yes') {
      payload1 = payload.inventory,
      payload2 = payload.serialnos,
      payload3 = payload.warranty
    } else {
      payload1 = payload.inventory,
      payload2 = payload.serialnos
    }
    const requestBody = {
      'inventory': payload1,
      'serialnos': payload2,
      'warranty': payload3
    };

    return this.http.post(url, requestBody)
  }

  UpdateInventory(payload: any) {
    let url = this.baseUrl + '/updateInventory_1_0';
    return this.http.put(url, payload)
  }

  deleteInventory(payload: any) {
    let url = this.baseUrl + `/deleteInventory_1_0/${payload.id}/${1}`;

    return this.http.delete(url);
  }


  updateWarranty(payload: any) {
    let url = this.baseUrl + '/updateWarranty_1_0';
    return this.http.put(url, payload)
  }

  deleteWarranty(payload: any) {
    let url = this.baseUrl + `/deleteWarranty_1_0/${payload.id}/${1}`;

    return this.http.delete(url);
  }

  updateAssetStatus(id: any, payload: any) {
    let url = this.baseUrl + "/updateInventoryStatus_1_0";
    const params = new HttpParams().set('idRreplacedWith', id).set('statusId', payload.statusId).set('newProductSerialNo', payload.newProductSerialNo).set('modifiedBy', payload.modifiedBy);

    return this.http.put(url, null, {params: params});
  }

  filteBody(payload: any) {
    let url = this.baseUrl + `/listInventory_1_0`;

    return this.http.get(url, {params: payload});
  }

}
