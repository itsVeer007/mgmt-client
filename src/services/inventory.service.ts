import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  baseUrl = 'http://192.168.0.119:8080';

  constructor(private http: HttpClient, public datepipe: DatePipe) { }

  getListing() {
    let url = this.baseUrl + "/listInventory_1_0";
    return this.http.get(url);
  }

  getWarranty(id: any) {
    let url = this.baseUrl + `/getwarrantydetails_1_0?inventoryId=${id}`;
    return this.http.get(url);
  }

  createInventory(payload: any) {
    let url = this.baseUrl + '/createBothInvAndWarr_1_0';
    // payload.warr.startDate = this.datepipe.transform(payload.warr.startDate, 'yyyy-MM-dd');
    return this.http.post(url, payload)
  }

  UpdateInventory(payload: any) {
    let url = this.baseUrl + '/updateInventory_1_0';
    return this.http.put(url, payload)
  }

  UpdateWarranty(payload: any) {
    let url = this.baseUrl + '/updateWarranty_1_0';
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
