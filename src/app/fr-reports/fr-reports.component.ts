import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { MetadataService } from 'src/services/metadata.service';
import { TicketService } from 'src/services/ticket.service';

@Component({
  selector: 'app-fr-reports',
  templateUrl: './fr-reports.component.html',
  styleUrls: ['./fr-reports.component.css']
})
export class FrReportsComponent implements OnInit {

  showLoader = false;
  constructor(
    private http: HttpClient,
    private ticketSer: TicketService,
    private metaDatSer: MetadataService,
    private datePipe: DatePipe,

    public dialog: MatDialog,
    public alertSer: AlertService
  ) { }

  siteData: any
  ngOnInit(): void {
    this.onGetMetadata();
  }

  body = {
    p_frId:null,
    p_startdate:null,
    p_enddate:null
  }
  reportsData:any = [];
  listFRReports() {
    this.ticketSer.listFRReports(this.body).subscribe((res)=> {
      console.log(res);
      this.reportsData = res;

    })
  }

  searchText: any;

  ticketOpen: any = [];
  ticketClose: any = [];
  ticketProgress: any = [];
  ticketRejected: any = [];


  priorityVal: any;
  statusVal: any;
  assignedTo: any;
  ticketType: any;
  sourceOfRequest: any
  onGetMetadata() {
    this.metaDatSer.getMetadata().subscribe((res: any) => {
      // console.log(res);
      for(let item of res) {
        if(item.type == 'Ticket_Status') {
          this.statusVal = item.metadata;
        } else if(item.type == "Ticket_Priority") {
          this.priorityVal = item.metadata;
        } else if(item.type == "Assigned_To") {
          this.assignedTo = item.metadata;
        } else if(item.type == "Ticket_Type") {
          this.ticketType = item.metadata;
        } else if(item.type == "Source_of_Request") {
          this.sourceOfRequest = item.metadata;
        }
      }
    })
  }

  sId: any = '';
  tId: any = '';
  tStatus: any = '';
  stDt: any;
  enDt: any;

  applyFilter() {
    let myObj = {
      'siteId': this.sId ? this.sId : -1,
      'typeId': this.tId ? this.tId : -1,
      'ticketStatus': this.tStatus ? this.tStatus : '',
      'startDate': this.stDt ? this.datePipe.transform(this.stDt,'yyyy-MM-dd HH:mm:ss') : '',
      'endDate': this.enDt ? this.datePipe.transform(this.enDt,'yyyy-MM-dd HH:mm:ss') : ''
    }

    this.ticketSer.filterTicket(myObj).subscribe((res: any) => {
      // console.log(res);
      // this.newTicketData = res;
    })
  }

  currentid = 0;
  closeDot(e: any, i: any) {
    this.currentid = i;
    var x = e.target.parentNode.nextElementSibling;
    if (x.style.display == 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  }

  showAddSite = false;
  showAddCamera = false;
  showAddCustomer = false;
  showAddUser = false;
  showAddBusinessVertical = false;
  showSite = false;

  closenow(value: any, type: String) {
    if (type == 'ticket') { this.showTicket = value; }
  }

  showTicket: boolean = false;

  show(type: string) {
    if (type == 'ticket') { this.showTicket = true }
  }


  currentItem: any;
  originalObject: any;
  changedKeys: any = [];

  @ViewChild('viewTicketDialog') viewTicketDialog = {} as TemplateRef<any>;
  ticketTasks: any;
  ticketVisits: any;
  ticketComments: any = [];
  openViewPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.viewTicketDialog);
    // console.log(this.currentItem);
    this.ticketSer.getTasks(item.ticketId).subscribe((tasks: any) => {
      // console.log(res);
      this.ticketTasks = tasks;
    });

    this.ticketSer.getTicketVisits(item.ticketId).subscribe((visits: any) => {
      // console.log(res);
      this.ticketVisits = visits;
    });

    this.ticketSer.getcomments(item.ticketId).subscribe((comments: any) => {
      this.ticketComments = comments;
    });

    // this.ticketSer.comment$.subscribe((cmt: any) => {
    //   console.log(cmt);
    //   this.ticketComments = cmt;
    // })
  }


  assignedObj = {
    assignedTo: ""
  }

  @ViewChild('assignedDialog') assignedDialog = {} as TemplateRef<any>;

  toAssign: any;
  openAssigned(item: any) {
    // console.log(item)
    this.toAssign = item;
    this.dialog.open(this.assignedDialog);
  }

  toAssigned() {
    let myObj = {
      'ticketId': this.toAssign.ticketId,
      'assignedTo': this.assignedObj.assignedTo,
      "assignedBy": 1
    }

    this.ticketSer.assignTicket(myObj).subscribe((res: any) => {
      // console.log(res);
        this.alertSer.snackSuccess(res?.message);
    }, (err: any) => {
        if(err) {
          this.alertSer.error(err?.error?.message);
        }
    })
  }


  cmtValue: any;
  newComment: any = [];
  todayDate = new Date();
  createComment() {
    this.newComment.push(this.cmtValue);
    let myObj = {
      'ticketId': this.currentItem.ticketId,
      'message': this.cmtValue,
      'createdBy': 1
    }

    this.ticketSer.createComment(myObj).subscribe((res: any) => {
    this.ticketSer.comment$.next(res);
    });
    this.cmtValue = ''
  }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.reportsData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}
