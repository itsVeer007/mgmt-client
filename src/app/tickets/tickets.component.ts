import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { TicketService } from 'src/services/ticket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  showLoader = false;
  constructor(
    private http: HttpClient,
    private ticketSer: TicketService,
    private inventorySer: InventoryService,
    private metaDatSer: MetadataService,
    private datePipe: DatePipe,

    public dialog: MatDialog,
    public alertSer: AlertService
  ) { }

  siteData: any
  ngOnInit(): void {
    this.listTickets();
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

  searchText: any;
  ticketData: any = [];
  newTicketData: any = [];

  ticketOpen: any = [];
  ticketClose: any = [];
  ticketProgress: any = [];
  ticketRejected: any = [];
  errMsg: any = null;
  listTickets() {
    this.showLoader = true;
    this.ticketSer.listTickets().subscribe((res: any) => {
      this.showLoader = false;
      this.ticketData = res;
      // this.ticketSer.mainTicketData = res;
      this.newTicketData = this.ticketData?.sort((a: any, b: any) => a?.ticketId < b?.ticketId ? 1 : a?.ticketId > b?.ticketId ? -1 : 0);
      if(this.ticketData?.length == 0) {
        this.errMsg = 'No tickets';
      } else {
        this.errMsg = null;
      }
      for(let item of this.ticketData) {
        if(item.ticketStatus == 'Open') {
          this.ticketOpen.push(item)
        } else if(item.ticketStatus == 'In Progress') {
          this.ticketProgress.push(item)
        } else if(item.ticketStatus == 'Closed') {
          this.ticketClose.push(item)
        }
        // else if(item.ticketStatus == 'Rejected') {
        //   this.ticketRejected.push(item)
        // }
      }
    }, (err: any) => {
      // console.log(err);
      this.showLoader = false;
      if(err?.status == 0) {
        this.errMsg = 'Connection timed out';
      } else if(err.error) {
        this.errMsg = err?.message;
      } else {
        this.errMsg = null;
      }
    })
  }

  usedItems: any = [];
  @ViewChild('usedItemsDialog') usedItemsDialog = {} as TemplateRef<any>;
  listIndentItems(data: any) {
    // console.log(data)
    this.dialog.open(this.usedItemsDialog);

    this.ticketSer.listIndentItems(data).subscribe((res: any) => {
      // console.log(res);
      this.usedItems = res;
    })
  }

  duplicateSiteName: any;
  duplicateTicketType: any
  removeDuplicates() {
    this.duplicateSiteName = this.ticketData.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.ticketType == current.ticketType);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.duplicateTicketType = this.ticketData.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.ticketType == current.ticketType);
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
  sourceOfRequest: any;
  ticketPriority: any;
  ticketCategory: any;
  ticketSubCategory: any;
  taskReason: any;
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
        } else if(item.type == 'Ticket_Category') {
          this.ticketCategory = item.metadata;
        } else if(item.type == 'Ticket_Sub_Category') {
          this.ticketSubCategory = item.metadata;
        } else if(item.type == 'Task_Reason') {
          this.taskReason = item.metadata;
        }
      }
    })
  }

  ticketStatusObj = {
    siteId: null,
    typeId: null,
    ticketStatus: null,
    startDate: null,
    endDate: null
  }

  applyFilter() {
    this.showLoader = true;
    this.ticketSer.filterTicket(this.ticketStatusObj).subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      this.newTicketData = res;
      if(this.newTicketData?.length == 0) {
        this.errMsg = 'No tickets'
      } else {
        this.errMsg = null;
      }
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

  showTicket: boolean = false;
  showIndent: boolean = false;
  show(type: string) {
    if (type == 'ticket') { this.showTicket = true }
    if (type == 'indent') { this.showIndent = true }
  }

  closenow(type: String) {
    if (type == 'ticket') { this.showTicket = false }
    if (type == 'indent') { this.showIndent = false }
  }

  taskBody = {
    ticketId: null,
    categoryId: null,
    subCategoryId: null,
    // reasonId: null,
    createdBy: 1,
    priorityId: null
  }

  @ViewChild('addTaskDialog') addTaskDialog = {} as TemplateRef<any>;
  openAddTask() {
    // this.currentItem = item;
    this.dialog.open(this.addTaskDialog, {maxWidth: '550px', maxHeight: '550px'});
  }

  createTask() {
    this.taskBody.ticketId = this.currentItem?.ticketId;
    this.ticketSer.createTask(this.taskBody).subscribe((res: any) => {
      // console.log(res);
      this.alertSer.snackSuccess(res?.message);
    }, (err: any) => {
      this.alertSer.error(err?.error?.message);
    })
  }



  currentItem: any;
  originalObject: any;
  changedKeys: any = [];

  @ViewChild('viewTicketDialog') viewTicketDialog = {} as TemplateRef<any>;
  ticketTasks: any[] = [];
  ticketVisits: any[] = [];
  ticketComments: any = [];
  openViewPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.viewTicketDialog);
    this.ticketSer.getTasks(item?.ticketId).subscribe((tasks: any) => {
      // console.log(res);
      this.ticketTasks = tasks;
    });

    this.ticketSer.getTicketVisits(item.ticketId).subscribe((visits: any) => {
      // console.log(res);
      this.ticketVisits = visits;
    });

    // this.ticketSer.getcomments(item.ticketId).subscribe((comments: any) => {
    //   this.ticketComments = comments;
    // });
  }


  @ViewChild('editTicketDialog') editTicketDialog = {} as TemplateRef<any>;
  openEditPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.editTicketDialog, {maxWidth: '550px', maxHeight: '550px'});
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
        this.alertSer.success(res?.message);
        this.listTickets();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }


  @ViewChild('deleteTicketDialog') deleteTicketDialog = {} as TemplateRef<any>;

  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteTicketDialog, {maxWidth: '250px', maxHeight: '250px'})
    // console.log(item);
  }

  confirmDeleteRow() {
    this.ticketSer.deleteTicket(this.currentItem).subscribe((res: any) => {
      // console.log(res);

      if(res) {
        this.alertSer.snackSuccess(res?.message);
        this.listTickets();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
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
    this.dialog.open(this.assignedDialog, {maxWidth: '250px', maxHeight: '250px'});
  }

  toAssigned() {
    // this.alertSer.wait();
    let myObj = {
      'ticketId': this.toAssign.ticketId,
      'assignedTo': this.assignedObj.assignedTo,
      "assignedBy": 1
    }

    this.ticketSer.assignTicket(myObj).subscribe((res: any) => {
      // console.log(res)
      if(res) {
        this.alertSer.snackSuccess(res?.message);
        this.listTickets();
      }
    }, (err: any) => {
        if(err) {
          this.alertSer.error(err?.error?.message);
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
    // this.alertSer.wait();
    this.ticketSer.updateTask(statusObj).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.snackSuccess(res?.message);
        this.listTickets();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
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

  sort1(label: any) {
    this.sorted = !this.sorted;
    var x = this.usedItems;
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
    this.listTickets();
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
