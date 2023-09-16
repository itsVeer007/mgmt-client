import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  comment$ = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient) { }

  mainTicketData: any = [];

  // baseUrl = `${environment.baseUrl}/inventoryAndtickets`;
  baseUrl = 'http://192.168.0.137:8080';

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

  listIndentItems(payload: any) {
    let url = this.baseUrl + `/listIndentItems_1_0`;
    let params = new HttpParams().set('ticketId', payload?.ticketId).set('status', 4);

    return this.http.get(url, {params: params});
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


  /* FR Service */

  listFRSites(frId: any) {
    let url = this.baseUrl + `/listFRSites_1_0/${frId}`;
    return this.http.get(url);
  }

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
    let myObj = {
      'taskId': payload.taskId,
      'statusId': payload.statusId,
      'fieldVisitId': payload.fieldVisitId,
      'changedBy': payload.changedBy,
      'remarks': payload.remarks,
    }

    return this.http.post(url, myObj);
  }

  fieldVisitExit(payload: any) {
    let url = this.baseUrl + `/fieldVisitExit_1_0`;
    let myObj = {
      'frId': payload.frId,
      'travelAllowance': payload.travelAllowance,
      'foodAllowance': payload.foodAllowance,
      'otherAllowance': payload.otherAllowance,
      'remarks': payload.remarks
    }

    return this.http.put(url, myObj);
  }

  updateIndentStatus(currentId: any, payload: any){
    let url = this.baseUrl + `/updateIndentStatus_1_0/${currentId.id}/${payload.statusId}/${payload.createdBy}`;
    return this.http.put(url, null);
  }


  /* ticket reort */

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

}
