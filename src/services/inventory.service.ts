import { DatePipe, formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  // baseUrl = `${environment.baseUrl}/inventoryAndtickets`;
  baseUrl = 'http://192.168.0.137:8080';
  comment$: any = new BehaviorSubject(null);

  constructor(private http: HttpClient, public datepipe: DatePipe) { }

  /* inventory */

  listItemCode(payload: any) {
    let url = this.baseUrl + '/listItemCode_1_0';
    let params = new HttpParams();

    if(payload.partType) {
      params = params.set('p_part_type', payload.partType)
    }
    if(payload.partCategory) {
      params = params.set('p_part_category', payload.partCategory)
    }
    if(payload.partCode) {
      params = params.set('p_part_code', payload.partCode)
    }
    if(payload.buildType) {
      params = params.set('p_build_type', payload.buildType)
    }

    return this.http.get(url, {params: params})
  }

  listBrandAndModel(payload: any) {
    let url = this.baseUrl + '/listBrandAndModel_1_0';
    let params = new HttpParams().set('p_item_code', payload.itemCode).set('p_brand', payload.brand);

    // if(payload.itemCode) {
    //   params = params.set('p_item_code', payload.itemCode)
    // }
    // if(payload.brand) {
    //   params = params.set('p_brand', payload.brand)
    // }

    return this.http.get(url, {params: params})
  }


  listInventory() {
    let url = this.baseUrl + `/listInventory_1_0`;
    let params = new HttpParams().set('startDate', '2023-08-05').set('end1_date', formatDate(new Date(), 'yyyy-MM-dd', 'en-us'));
    return this.http.get(url, {params: params});
  }

  listInventoryByProductId(productId: any) {
    let url = this.baseUrl + `/listInventoryByProductId_1_0?productId=${productId}`;
    return this.http.get(url);
  }

  listDetails(payload: any) {
    let url = this.baseUrl + `/listDetails12`;
    let params = new HttpParams().set('t_item_code', payload.itemCode).set('status_id', 4);
    return this.http.get(url, {params: params});
  }

  listDetailsByStatus(payload: any) {
    let url = this.baseUrl + `/listDetails12`;
    let params = new HttpParams().set('status_id', payload);
    return this.http.get(url, {params: params});
  }

  createInventory(payload: any, condition: any) {
    let url = this.baseUrl + '/createInventoryAndWarranty_1_0';
    let payload1;
    let payload2;
    let payload3;
    //optional
    let payload4;

    if(condition == 'Y') {
      payload1 = payload?.inventory,
      payload2 = payload?.serialnos,
      payload3 = payload?.quantity,
      payload4 = payload?.warranty
    } else {
      payload1 = payload?.inventory,
      payload2 = payload?.serialnos,
      payload3 = payload?.quantity
    }
    const requestBody = {
      'inventory': payload1,
      'serialnos': payload2,
      'quantity': payload3,
      'warranty': payload4
    };

    return this.http.post(url, requestBody)
  }

  updateInventory(payload: any) {
    let url = this.baseUrl + '/updateInventory_1_0';
    return this.http.put(url, payload)
  }

  deleteInventory(payload: any) {
    let url = this.baseUrl + `/deleteInventory_1_0/${payload.id}/${1}`;

    return this.http.delete(url);
  }

  filterInventory(payload: any) {
    let url = this.baseUrl + `/listInventory_1_0`;

    let params = new HttpParams().set('startDate', formatDate(payload.startDate, 'yyyy-MM-dd', 'en-us')).set('end1_date', formatDate(payload.endDate, 'yyyy-MM-dd', 'en-us'));
    return this.http.get(url, {params: params});
  }


  /* warrenty service */

  getWarranty(id: any) {
    let url = this.baseUrl + `/listWarranty_1_0/${id}`;
    return this.http.get(url);
  }

  updateWarranty(payload: any) {
    let url = this.baseUrl + '/updateWarranty_1_0';
    return this.http.put(url, payload)
  }

  deleteWarranty(payload: any) {
    let url = this.baseUrl + `/deleteWarranty_1_0/${payload.id}/${1}`;

    return this.http.delete(url);
  }

  updateInventoryStatus(payload: any) {
    let url = this.baseUrl + "/updateInventoryStatus_1_0";
    let params = new HttpParams();
    if (payload.slNo) {
      params = params.set('slNo', payload.slNo);
    }
    if (payload.statusId) {
      params = params.set('statusId', payload.statusId);
    }
    if (payload) {
      params = params.set('modifiedBy', 1);
    }

    return this.http.put(url, null, {params: params});
  }

  listInventoryByItemCode(payload: any) {
    let url = this.baseUrl + "/listInventoryByItemCode_1_0";
    let params = new HttpParams().set('itemCode', payload.itemCode ? payload.itemCode : payload.suggestedItemCode);

    return this.http.get(url, {params: params});
  }

  // dcgetitemcode
  getItemCode(payload: any) {
    let url = this.baseUrl + "/getItemCode_1_0";
    let params = new HttpParams().set('name', payload?.materialDescription ?(payload?.materialDescription) : payload);

    return this.http.get(url, {params: params});
  }


  /* product-master */

  listProduct() {
    let url = this.baseUrl + "/listProducts_1_0";
    return this.http.get(url);
  }

  addingproduct(payload: any) {
    let url = this.baseUrl + '/createProduct_1_0';
    return this.http.post(url, payload)
  }

  updateProductMaster(payload: any) {
    let url = this.baseUrl + '/updateProduct_1_0';
    return this.http.put(url, payload)
  }

  deleteProduct(payload: any) {
    let url = this.baseUrl + `/deleteProduct_1_0/${payload.id}/${1}`;
    return this.http.delete(url);
  }

  listByVendor() {
    let url = this.baseUrl + "/listProduct_1_0";
    return this.http.get(url);
  }


  filterProductMaster(payload: any) {
    let url = this.baseUrl + `/listProduct_1_0`;
    let params = new HttpParams();
    if (payload.categoryId) {
      params = params.set('categoryId', payload.categoryId);
    }
    if (payload.typeId) {
      params = params.set('typeId', payload.typeId);
    }
    if (payload.statusId) {
      params = params.set('statusId', payload.statusId);
    }
    if (payload.startDate) {
      params = params.set('startDate', payload.startDate);
    }
    if (payload.endDate) {
      params = params.set('endDate', payload.endDate);
    }
    if (payload.vendorId) {
      params = params.set('vendorId', payload.vendorId);
    }

    return this.http.get(url, {params: params});
  }


  /* indents */

  listIndent() {
    let url = this.baseUrl + "/listIndents_1_0";
    return this.http.get(url);
  }

  listIndentItems(payload: any) {
    let url = this.baseUrl + "/listIndentItems_1_0";
    let params = new HttpParams().set('ticketId', payload?.ticketId);

    // if (payload.ticketId) {
    //   params = params.set('ticketId', payload.id);
    // }

    return this.http.get(url, {params: params});
  }

  listIndentItems1(payload: any) {
    let url = this.baseUrl + `/listIndentItems_1_0`;
    let params = new HttpParams().set('ticketId', payload?.ticketId).set('status', 4);

    return this.http.get(url, {params: params});
  }

  createIndent(payload: any) {
    let url = this.baseUrl + '/createIndent_1_0';
    return this.http.post(url, payload)
  }

  addComponent(payload: any) {
    let url = this.baseUrl + '/addComponent_1_0';
    return this.http.post(url, payload)
  }

  updateIndentStatus(payload1: any, payload2: any){
    let url = this.baseUrl + `/updateIndentStatus_1_0/${payload1.id}/${payload2.statusId}/${payload2.createdBy}/${payload2.inventoryId}`;
    return this.http.put(url, null);
  }

  updateIndentStatus1(currentId: any, payload: any){
    let url = this.baseUrl + `/updateIndentStatus_1_0/${currentId.id}/${payload.statusId}/${payload.createdBy}`;
    return this.http.put(url, null);
  }

  deleteIndent(payload: any) {
    let url = this.baseUrl + `/deleteIndent_1_0/${payload.id}`;
    return this.http.delete(url);
  }

  replaceComponent(payload: any) {
    let url = this.baseUrl + `/replaceComponent_1_0`;
    let params = new HttpParams();
    if(payload.oldInventoryId) {
      params = params.set('oldInventoryId', payload.oldInventoryId);
    }
    if(payload.newInventoryId) {
      params = params.set('newInventoryId', payload.newInventoryId);
    }
    if(payload.replacedBy) {
      params = params.set('replacedBy', payload.replacedBy);
    }
    if(payload.siteId) {
      params = params.set('siteId', payload.siteId);
    }

    return this.http.put(url, null, {params: params});
  }

  filterIndent(payload: any) {
    let url = this.baseUrl + `/listIndent_1_0`;
    return this.http.get(url, {params: payload});
  }


  /* ticket sevice */

  listTickets() {
    let url = this.baseUrl + "/listTickets_1_0";
    return this.http.get(url);
  }

  createTicket(payload: any) {
    let url = this.baseUrl + '/createTicket_1_0';
    return this.http.post(url, payload);
  }

  createTask(payload: any) {
    let url = this.baseUrl + '/createTask_1_0';
    return this.http.post(url, payload);
  }

  updateTicket(payload: any) {
    let url = this.baseUrl + '/updateTicket_1_0';
    return this.http.put(url, payload);
  }

  deleteTicket(payload: any) {
    let url = this.baseUrl + `/DeleteTicket?ticketId=${payload.ticketId}`;
    return this.http.delete(url);
  }

  listFRTickets() {
    let url = this.baseUrl + `/listFRTickets_1_0/${1565}`;
    return this.http.get(url);
  }

  getTasks(ticketId: any) {
    let url = this.baseUrl + `/listTasks_1_0/${ticketId}`;
    return this.http.get(url);
  }

  getTicketVisits(siteId: any) {
    let url = this.baseUrl + `/listFieldVisits_1_0/${siteId}`;
    // let myObj = {
    //   'ticketId': ticketId,
    // }
    return this.http.get(url);
  }

  assignTicket(payload: any) {
    let url = this.baseUrl + '/assignTicket_1_0';
    return this.http.put(url, payload);
  }

  updateTask(payload: any) {
    let url = this.baseUrl + '/updateTask_1_0';
    return this.http.put(url, payload);
  }

  filterTicket(payload: any) {
    let url = this.baseUrl + `/listTickets_1_0`;
    let params = new HttpParams();
    if(payload.siteId) {
      params = params.set('siteId', payload.siteId);
    }
    if(payload.typeId) {
      params = params.set('typeId', payload.typeId);
    }
    if(payload.ticketStatus) {
      params = params.set('ticketStatus', payload.ticketStatus);
    }
    if(payload.startDate) {
      params = params.set('startDate', formatDate(payload.startDate, 'yyyy-MM-dd', 'en-us'));
    }
    if(payload.endDate) {
      params = params.set('endDate', formatDate(payload.endDate, 'yyyy-MM-dd', 'en-us'));
    }

    return this.http.get(url, {params: params});
  }


  getcomments(ticketId: any) {
    let url = this.baseUrl + "/getComments_1_0";
    let myObj = {
      'ticketId': ticketId,
    }
    return this.http.get(url, {params: myObj});
  }

  createComment(payload: any) {
    let url = this.baseUrl + '/createComment_1_0';
    return this.http.post(url, payload);
  }


  /* ticket reort service */

  getTicketsReport() {
    let url = this.baseUrl + `/getTicketsReport_1_0`;
    return this.http.get(url);
  }

  getItemsList(payload: any) {
    let url = this.baseUrl + `/getItemsList_1_0`;
    let params = new HttpParams().set('siteId', payload?.siteId);

    return this.http.get(url, {params: params});
  }

  createFRKit(payload:any){
    let url = this.baseUrl + `/createFRKit_1_0`;
    return this.http.post(url, payload);
  }

  listFRCount() {
    let url = this.baseUrl + `/listFRCount_1_0`;
    return this.http.get(url);
  }

  getItemCodes(slNo: any) {
    let url = this.baseUrl + `/getItemCodes_1_0`;
    let params = new HttpParams().set('slNo', slNo)
    return this.http.get(url, {params: params});
  }

  listInventoryByItemCode_1_0(itemCode: any) {
    let url = this.baseUrl + `/listInventoryByItemCode_1_0`;
    let params = new HttpParams().set('itemCode', itemCode)
    return this.http.get(url, {params: params});
  }



  /* FR Service */

  listFRSites(frId: any) {
    let url = this.baseUrl + `/listFRSites_1_0/${frId}`;
    return this.http.get(url);
  }
// dcfritems
  listFRItems(frId: any, statusId: any) {
    let url = this.baseUrl + `/listFRItems_1_0`;
    let params = new HttpParams()
    if(frId) {
      params = params.set('frId', frId)
    }
    if(statusId){
      params = params.set('statusId', statusId)
    }
    return this.http.get(url, {params: params});
  }

  fieldVisitEntry(payload: any) {
    let url = this.baseUrl + `/fieldVisitEntry_1_0`;
    let myObj = {
      'frId': 1565,
      'siteId': payload?.siteId,
      'ticketId': payload?.ticketId
    }

    return this.http.post(url, myObj);
  }

  listFRTasksOfCurrentVisit(frId: any) {
    let url = this.baseUrl + `/listFRTasksOfCurrentVisit_1_0/${frId}`;
    return this.http.get(url);
  }

  logTaskStatus(payload: any) {
    let url = this.baseUrl + `/logTaskStatus_1_0`;
    return this.http.post(url, payload);
  }

  fieldVisitExit(payload: any) {
    let url = this.baseUrl + `/fieldVisitExit_1_0`;
    return this.http.put(url, payload);
  }

  updateDispatchToInventory(payload:any) {
    let url = this.baseUrl + `/updateDispatchToInventory_1_0`;
    return this.http.post(url, payload);
  }

  /* fr-reports */

  listFRReports(payload:any) {
    let url = this.baseUrl + "/listFRReports_1_0";
    let params = new HttpParams();
    if(payload.p_frId) {
      params = params.set('p_frId', payload.p_frId)
    }
    if(payload.p_startdate) {
      params = params.set('p_startdate', formatDate(payload.p_startdate, 'yyyy-MM-dd', 'en-us'))
    }
    if(payload.p_enddate) {
      params = params.set('p_enddate', formatDate(payload.p_enddate, 'yyyy-MM-dd', 'en-us'))
    }
    return this.http.get(url, {params:params});
  }

  listDC() {
    let url = this.baseUrl + `/listDC_2_0`;
    return this.http.get(url);
  }

  getlistByCreatedBy(payload: any) {
    let url = this.baseUrl + `/getlistByCreatedBy_1_0`;
    let params = new HttpParams()
    if(payload.createdBy) {
      params = params.set('createdBy',payload.createdBy)
    } 
    if(payload.dateOfChallan) {
      params = params.set('dateOfChallan', formatDate(payload.dateOfChallan, 'yyyy-MM-dd', 'en-us'))
    }
    return this.http.get(url, {params: params});
  }

  // dccreateDC
  createDC(payload:any) {
    let url = this.baseUrl + '/createDC_1_0';
    return this.http.post(url, payload )
  }

  listDescriptionOfGoodsByDcNumber(payload:any) {
    let url = this.baseUrl + `/listDescriptionOfGoodsByDcNumber_1_0`;
    let params = new HttpParams().set('dcNumber', payload.dcNumber)
      return this.http.get(url, {params:params});
  }

  updateDC(payload:any) {
    let url = this.baseUrl + `/updateDC_2_0`;
    let params = new HttpParams().set('dcNumber', payload.dcNumber).set('amount',payload.amount).set('receiptNo', payload.receiptNo).set('modifiedBy', payload.modifiedBy)
    return this.http.put(url, null, {params:params})
  }

  listQuantity(payload:any) {
    let url = this.baseUrl + `/listQuantity_1_0`;
    let params = new HttpParams().set('itemCode', payload?.itemCode).set('statusId', payload?.statusId).set('modifiedBy', payload?.modifiedBy)
      return this.http.get(url, {params:params});
  }

  getAllDC(payload:any) {
    let url = this.baseUrl + '/getAllDC_2_0';
    let params = new HttpParams()
    if(payload.createdBy) {
      params = params.set('createdBy',payload.createdBy)
    } 
    if(payload.dateOfChallan) {
      params = params.set('dateOfChallan', formatDate(payload.dateOfChallan, 'yyyy-MM-dd', 'en-us'))
    }
    if(payload.state) {
      params = params.set('state', payload.state)
    }
    return this.http.get(url, {params:params})
  }


  /* -------------------------------------------------------------- end ------------------------------------------------------------------------------------ */


  /* orders */

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

  filterOrders(payload: any) {
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



  /* vendor service */

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

