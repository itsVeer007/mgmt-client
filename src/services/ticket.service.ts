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
}
