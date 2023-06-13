import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  baseUrl = 'http://192.168.0.118:8080';

  constructor(private http: HttpClient) { }

  getTickets() {
    let url = this.baseUrl + "/GetTickets";
    return this.http.get(url);
  }

  createTicket(payload: any) {
    let url = this.baseUrl + '/CreateTicket';
    return this.http.post(url, payload);
  }

  assignPerson(payload: any) {
    let url = this.baseUrl + '/assignperson';
    return this.http.put(url, payload);
  }

  updateStatus(payload: any) {
    let url = this.baseUrl + '/updateStatus';
    return this.http.put(url, payload);
  }


  updateTicket(payload: any) {
    let url = this.baseUrl + '/updateTicket1';
    return this.http.put(url, payload);
  }

  deleteTicket(payload: any) {
    let url = this.baseUrl + `/DeleteTicket?ticketId=${payload.ticketId}`;

    return this.http.delete(url);
  }


  filteBody(payload: any) {
    let url = this.baseUrl + `/get?`;

    let myObj = {
      requestId: payload.requestId,
      status: payload.status,
      priority: payload.priority,
    }

    return this.http.get(url, {params: myObj});
  }

}
