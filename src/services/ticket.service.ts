import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  baseUrl = 'http://192.168.0.189:8080';

  constructor(private http: HttpClient) { }

  ticket$ = new BehaviorSubject(null);

  getTickets() {
    let url = this.baseUrl + "/getTickets_1_0";
    return this.http.get(url);
  }

  getTasks(ticketId: any) {
    let url = this.baseUrl + "/getTasks";

    let myObj = {
      'ticketId': ticketId,
    }

    return this.http.get(url, {params: myObj});
  }

  getcomments(ticketId: any) {
    let url = this.baseUrl + "/getcomments";

    let myObj = {
      'ticketId': ticketId,
    }

    return this.http.get(url, {params: myObj});
  }

  createTicket(payload: any) {
    let url = this.baseUrl + '/createTicket_1_0';
    return this.http.post(url, payload);
  }

  assignPerson(payload: any) {
    let url = this.baseUrl + '/updateTicket';
    return this.http.put(url, payload);
  }

  updateStatus(payload: any) {
    let url = this.baseUrl + '/updateStatus';
    return this.http.put(url, payload);
  }


  updateTicket(payload: any) {
    let url = this.baseUrl + '/updateTicket';
    return this.http.put(url, payload);
  }

  deleteTicket(payload: any) {
    let url = this.baseUrl + `/DeleteTicket?ticketId=${payload.ticketId}`;

    return this.http.delete(url);
  }


  filteBody(payload: any) {
    let url = this.baseUrl + `/getlist1`;

    let myObj = {
      'requestedBy': payload.requestId,
      'priorityId': payload.priority,
      'statusId': payload.status,
      'createdTime': payload.createdTime,
      'closedTime': payload.closedTime
    }

    return this.http.get(url, {params: myObj});
  }

}
