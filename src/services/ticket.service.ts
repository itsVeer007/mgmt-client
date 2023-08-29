import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  comment$ = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient) { }

  // baseUrl = `${environment.baseUrl}/tickets`;
  // base = 'http://192.168.0.137:8080';
  baseUrl = 'http://192.168.0.137:8080';

  listTickets() {
    let url = this.baseUrl + "/listTickets_1_0";
    return this.http.get(url);
  }

  createTicket(payload: any) {
    let url = this.baseUrl + '/createTicket_1_0';
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
    let myObj = {
      'siteId': payload.siteId,
      'typeId': payload.typeId,
      'ticketStatus': payload.ticketStatus,
      'startDate': payload.startDate,
      'endDate': payload.endDate
    }
    return this.http.get(url, {params: myObj});
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

  fieldVisitEntry(payload: any) {
    let url = this.baseUrl + `/fieldVisitEntry_1_0`;
    let myObj = {
      'frId': 1565,
      'siteId': payload.siteId,
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
      // 'travelAllowance': payload.travelAllowance,
      // 'foodAllowance': payload.foodAllowance,
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

}
