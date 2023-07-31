import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { MetadataService } from 'src/services/metadata.service';
import { TicketService } from 'src/services/ticket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    var x = <HTMLElement>document.getElementById(`plus-img${this.currentid}`);
    var y = <HTMLElement>document.getElementById(`icons-site`);

    // console.log(`plus-img${this.currentid}`);
    if (x != null) {
      if (!x.contains(e.target)) {
        if (x.style.display == 'flex' || x.style.display == 'block') {
          x.style.display = 'none';
        }
      }
    }

    // if (y != null) {
    //   console.log(`icons-site`);
    //   if (!y.contains(e.target)) {
    //     this.icons1 = false;
    //   }
    // }
  }




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
    this.CustomerReport();
    this.onGetMetadata();

    this.siteData = JSON.parse(localStorage.getItem('siteIds')!);

    // this.ticketSer.comment$.subscribe((comments: any) => {
    //   this.ticketComments = comments;
    // });
  }

  // fileName= 'ExcelSheet.xlsx';

  // exportexcel(): void {
  //     let element = document.getElementById('excel-table');
  //     const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

  //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //     XLSX.writeFile(wb, this.fileName);
  // }

  showIconView: boolean = false;
  showIconEdit: boolean = false;
  showIconDelete: boolean = false;
  showIconView1: boolean = false;
  showIconEdit1: boolean = false;
  showIconDelete1: boolean = false;

  searchText: any;
  ticketData: any = [];
  newTicketData: any = [];

  ticketOpen: any = [];
  ticketClose: any = [];
  ticketProgress: any = [];
  ticketRejected: any = [];
  CustomerReport() {
    this.showLoader = true;
    this.ticketSer.getTickets().subscribe((res: any) => {
      this.showLoader = false;
      this.ticketData = res;
      this.newTicketData = this.ticketData;

      for(let item of this.ticketData) {
        if(item.ticketStatus == 'Open') {
          this.ticketOpen.push(item)
        } else if(item.ticketStatus == 'Inprogress') {
          this.ticketProgress.push(item)
        } else if(item.ticketStatus == 'Closed') {
          this.ticketClose.push(item)
        } else if(item.ticketStatus == 'Rejected') {
          this.ticketRejected.push(item)
        }
      }
    })
  }

  siteNames: any;
  removeDuplicates() {
    this.siteNames = this.ticketData.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.requestedBy == current.requestedBy);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    // this.priorityVal = this.ticketData.reduce((acc: any, current: any) => {
    //   const x = acc.find((item: any) => item.priorityId == current.priorityId);
    //   if (!x) {
    //     return acc.concat([current]);
    //   } else {
    //     return acc;
    //   }
    // }, []);

    // this.statusVal = this.ticketData.reduce((acc: any, current: any) => {
    //   const x = acc.find((item: any) => item.statusId == current.statusId);
    //   if (!x) {
    //     return acc.concat([current]);
    //   } else {
    //     return acc;
    //   }
    // }, []);
  }

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

    this.ticketSer.filteBody(myObj).subscribe((res: any) => {
      // console.log(res);
      this.newTicketData = res;
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
    this.dialog.open(this.viewTicketDialog, {maxHeight: '550px', maxWidth: '850px'});
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


  @ViewChild('editTicketDialog') editTicketDialog = {} as TemplateRef<any>;
  openEditPopup(item: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.dialog.open(this.editTicketDialog, {maxHeight: '550px', maxWidth: '550px'});
    // console.log(this.currentItem);
  }

  onInputChange(e: any) {
    this.originalObject = {
      "ticketId": this.currentItem.ticketId,
      "ticketTypeId": e.ticketTypeId,
      "description": e.description,
      "requestedBy": e.requestedBy,
      "sourceOfRequestId": e.sourceOfRequestId,
      "assignedTo": e.assignedTo,
      "priorityId": e.priorityId,
      "statusId": e.statusId,
      "indentRequested": e.indentRequested,
      'ticketReason': e.ticketReason,
      'remarks': e.remarks
    };

    let x = e.target['name'];

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onSelectChange(e: any) {
    this.originalObject = {
      "ticketId": this.currentItem.ticketId,
      "ticketTypeId": e.ticketTypeId,
      "description": e.description,
      "requestedBy": e.requestedBy,
      "sourceOfRequestId": e.sourceOfRequestId,
      "assignedTo": e.assignedTo,
      "priorityId": e.priorityId,
      "statusId": e.statusId,
      "indentRequested": e.indentRequested,
      'ticketReason': e.ticketReason,
      'remarks': e.remarks
    };

    let x = e.source.ngControl.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }


  updateTicket(e: any) {
    this.originalObject = {
      "ticketId": this.currentItem.ticketId,
      "ticketTypeId": e.ticketTypeId,
      "description": e.description,
      "requestedBy": e.requestedBy,
      "sourceOfRequestId": e.sourceOfRequestId,
      "assignedTo": e.assignedTo,
      "priorityId": e.priorityId,
      "statusId": e.statusId,
      "indentRequested": e.indentRequested,
      'ticketReason': e.ticketReason,
      'remarks': e.remarks
    };

    this.alertSer.wait();
    this.ticketSer.updateTicket({ticket: this.originalObject, updprops: this.changedKeys}).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res);
      }
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }, (err: any) => {
      if(err) {
        this.alertSer.error();
      };
    });
  }


  @ViewChild('deleteTicketDialog') deleteTicketDialog = {} as TemplateRef<any>;

  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteTicketDialog, {maxHeight: '250px', maxWidth: '250px'})
    // console.log(item);
  }

  confirmDeleteRow() {
    this.alertSer.wait();
    this.ticketSer.deleteTicket(this.currentItem).subscribe((res: any) => {
      // console.log(res);

      if(res) {
        this.alertSer.success(res);
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error();
      };
    })
  }


  assignedObj = {
    assignedTo: ""
  }

  @ViewChild('assignedDialog') assignedDialog = {} as TemplateRef<any>;

  toAssign: any;
  openAssigned(item: any) {
    this.toAssign = item;
    this.dialog.open(this.assignedDialog, {maxHeight: '250px', maxWidth: '250px'});
  }

  toAssigned() {
    this.alertSer.wait();
    let myObj = {
      'ticketId': this.toAssign.id,
      'assignedTo': this.assignedObj.assignedTo,
      "assignedBy": 1
    }

    this.ticketSer.assignTicket(myObj).subscribe((res: any) => {
      // console.log(res)
      if(res) {
        this.alertSer.success(res);
      }
      setTimeout(() => {
        // window.location.reload();
      }, 3000)
    }, (err: any) => {
        if(err) {
          this.alertSer.error();
        }
    })
  }

  @ViewChild('editStatusDialog') editStatusDialog = {} as TemplateRef<any>;

  y: any
  openEditStatus(id: any) {
    this.y = id;
    this.dialog.open(this.editStatusDialog, {maxWidth: '250px', maxHeight: '250px'});
  }

  staObj = {
    status: ""
  }

  changeAssetStatus() {
    let statusObj = {
      ticketId: this.y.ticketId,
      status: this.staObj.status
    }
    this.alertSer.wait();
    this.ticketSer.updateStatus(statusObj).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res);
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error();
      };
    })
  }


  /* create comment */

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
    var x = this.ticketData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }


 /* checkbox control */

  selectedAll: any;
  selectAll() {
    for (var i = 0; i < this.ticketData.length; i++) {
      this.ticketData[i].selected = this.selectedAll;
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.ticketData.every(function (item: any) {
      return item.selected == true;
    })
  }

  viewArray: any = [];
  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      this.dialog.open(this.viewTicketDialog, {maxWidth: '850px', maxHeight: '550px'})
    }
  }

  ViewByCheckbox(itemV: any, i: any, e: any) {
    var checked = (e.target.checked);
    if (checked == true && this.viewArray.includes(itemV) == false) {
      this.viewArray.push(itemV);
      this.currentItem = this.viewArray[(this.viewArray.length - 1)];
    }
    if (checked == false && this.viewArray.includes(itemV) == true) {
      this.viewArray.splice(this.viewArray.indexOf(itemV), 1)
    }
  }

  editArray: any = [];
  editBySelectedOne() {
    if (this.editArray.length > 0) {
      this.dialog.open(this.editTicketDialog, {maxWidth: '550px', maxHeight: '550px'})
    }
    this.CustomerReport();
  }

  EditByCheckbox(itemE: any, i: any, e: any) {
    var checked = (e.target.checked);
    if (checked == true && this.editArray.includes(itemE) == false) {
      this.editArray.push(itemE);
      this.currentItem = this.editArray[(this.editArray.length - 1)];
    }
    if (checked == false && this.editArray.includes(itemE) == true) {
      this.editArray.splice(this.editArray.indexOf(itemE), 1)
    }
  }

  deletearray: any = [];
  deleteMultiRecords(item: any, i: any, e: any) {
    var checked = (e.target.checked);
    if (this.deletearray.length == 0) { this.deletearray.push(item) }

    this.deletearray.forEach((el: any) => {
      if (el.siteId != item.siteId && checked) {
        this.deletearray.push(item);
        this.deletearray = [...new Set(this.deletearray.map((item: any) => item))]
      }
      if (el.siteId == item.siteId && !checked) {
        var currentindex = this.deletearray.indexOf(item);
        this.deletearray.splice(currentindex, 1)
      }
    });
  }

  deleteSelected() {
    if (this.selectedAll == false) {
      this.deletearray.forEach((el: any) => {
        this.ticketData = this.ticketData.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.ticketData.forEach((el: any) => {
        this.ticketData = this.ticketData.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }

}
