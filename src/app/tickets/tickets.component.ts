import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
  constructor(private http: HttpClient, private ticketSer: TicketService, public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.CustomerReport();
    // this.getSites();
  }

  showIconVertical: boolean = false;
  showIconCustomer: boolean = false;
  showIconSite: boolean = false;
  showIconCamera: boolean = false;
  showIconAnalytic: boolean = false;
  showIconUser: boolean = false;

  showIconView: boolean = false;
  showIconEdit: boolean = false;
  showIconDelete: boolean = false;
  showIconView1: boolean = false;
  showIconEdit1: boolean = false;
  showIconDelete1: boolean = false;

  searchText: any;
  ticketData: any = [];
  newTicketData: any = [];
  CustomerReport() {
    // this.http.get('assets/JSON/customerData.json').subscribe(res => {
    //   this.ticketData = res;
    //   // console.log(res)
    // });

    this.ticketSer.getTickets().subscribe((res: any) => {
      // console.log(res);
      this.ticketData = res;
      this.newTicketData = this.ticketData;
    })
  }

  // filterBySite(val: any) {
  //   if(val == 'none') {
  //     this.newTicketData = this.ticketData;
  //   } else {
  //     this.newTicketData = this.ticketData.filter((el: any) => el.site == val);
  //   }
  // }

  // filterByPriority(val: any) {
  //   if(val == 'none') {
  //     this.newTicketData = this.ticketData;
  //   } else {
  //     this.newTicketData = this.ticketData.filter((el: any) => el.priority == val)
  //   }
  // }

  // filterByStatus(val: any) {
  //   if(val == 'none') {
  //     this.newTicketData = this.ticketData;
  //   } else {
  //     this.newTicketData = this.ticketData.filter((el: any) => el.status == val)
  //   }
  // }

  siteNames: any;
  priorityVal: any;
  statusVal: any;
  removeDuplicates() {
    this.siteNames = this.ticketData.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.requestId == current.requestId);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.priorityVal = this.ticketData.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.priority == current.priority);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.statusVal = this.ticketData.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.status == current.status);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
  }

  rqsId: any;
  sta: any;
  prior: any;

  filterMsg: string = '';

  applyFilter() {
    let myObj = {
      requestId: this.rqsId ? this.rqsId : 0,
      status: this.sta ? this.sta : '',
      priority: this.prior ? this.prior : '',
    }

    this.ticketSer.filteBody(myObj).subscribe((res: any) => {
      // console.log(res);
      this.newTicketData = res;

      if(res == null) {
        this.filterMsg = 'No Data';
      }
    })
  }

  currentid = 0;
  closeDot(e: any, i: any) {
    this.currentid = i;
    var x = e.target.parentNode.nextElementSibling;
    // console.log("THREE DOTS:: ",e.target.parentNode.nextElementSibling);
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

  masterSelected: boolean = false;

  // allchecked(e:any){
  //   if(document.querySelector('#allchecked:checked')){
  //     this.masterSelected = true;
  //   }else {
  //     this.masterSelected = false;
  //   }
  // }


  selectedAll: any;
  selectAll() {
    for (var i = 0; i < this.ticketData.length; i++) {
      // console.log(this.ticketData[i])
      this.ticketData[i].selected = this.selectedAll;
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.ticketData.every(function (item: any) {
      // console.log(item)
      return item.selected == true;
    })
  }


  currentItem: any;
  originalObject: any;

  @ViewChild('viewTicketDialog') viewTicketDialog = {} as TemplateRef<any>;

  openViewPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.viewTicketDialog);
    // console.log(this.currentItem);
  }


  // deleteRow1(item: any, i: any) {
  //   console.log("DELETEROW:: ", item);
  //   this.showLoader = true;
  //   setTimeout(() => {
  //     this.showLoader = false;
  //     this.ticketData.splice(i, 1);
  //   }, 1000);
  // }



  @ViewChild('editTicketDialog') editTicketDialog = {} as TemplateRef<any>;

  openEditPopup(item: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.dialog.open(this.editTicketDialog);
    // console.log(this.currentItem);
  }

  updateTicket0: any;
  updateTicket1: any;
  updateTicket2: any;
  updateTicket(el: any) {

    this.originalObject = {
      "ticketId": el.ticketId,
      "site": el.site,
      "siteId": 1102,
      "description": el.description,
      "priority": el.priority,
      "status": el.status,
    };

    this.updateTicket2 = Swal.fire({
      text: "Please wait",
      imageUrl: "assets/gif/ajax-loading-gif.gif",
      showConfirmButton: false,
      allowOutsideClick: false
    });

    this.ticketSer.updateTicket(this.originalObject).subscribe((res: any) => {
      // console.log(res);

      if(res) {
        this.updateTicket1 = Swal.fire({
          icon: 'success',
          title: 'Done!',
          text: 'Updated Ticket Successfully!',
        });
      }
    }, (err: any) => {
      if(err) {
        this.updateTicket0 = Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Ticket Updation failed',
          // timer: 3000,
        });
      };
    });
  }


  @ViewChild('deleteTicketDialog') deleteTicketDialog = {} as TemplateRef<any>;

  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteTicketDialog)
    // console.log(item);
  }

  deleteTicket0: any;
  deleteTicket1: any;
  deleteTicket2: any;
  confirmDeleteRow() {

    this.deleteTicket2 = Swal.fire({
      text: "Please wait",
      imageUrl: "assets/gif/ajax-loading-gif.gif",
      showConfirmButton: false,
      allowOutsideClick: false
    });

    // this.ticketData = this.ticketData.filter((item: any) => item.siteId !== this.currentItem.siteId);

    this.ticketSer.deleteTicket(this.currentItem).subscribe((res: any) => {
      // console.log(res);

      if(res) {
        this.deleteTicket1 = Swal.fire({
          icon: 'success',
          title: 'Done!',
          text: 'Deleted Successfully!',
        });
      }
    }, (err: any) => {
      if(err) {
        this.deleteTicket0 = Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'failed',
          // timer: 3000,
        });
      };
    })
  }


  assignedObj = {
    assignedTo: ""
  }

  @ViewChild('assignedDialog') assignedDialog = {} as TemplateRef<any>;

  x: any
  openAssigned(item: any) {
    this.x = item;
    this.dialog.open(this.assignedDialog);
  }

  toAssigned() {
    let myObj = {
      'ticketId': this.x.ticketId,
      'assignedTo': this.assignedObj.assignedTo
    }

    this.ticketSer.assignPerson(myObj).subscribe((res: any) => {
      // console.log(res)
    })
  }

  @ViewChild('editStatusDialog') editStatusDialog = {} as TemplateRef<any>;

  y: any
  openEditStatus(id: any) {
    // console.log(id);
    this.y = id;
    this.dialog.open(this.editStatusDialog);
  }

  staObj = {
    status: ""
  }

  ticketStatus0: any;
  ticketStatus1: any;
  ticketStatus2: any;
  changeAssetStatus() {
    let statusObj = {
      ticketId: this.y.ticketId,
      status: this.staObj.status
    }

    this.ticketStatus2 = Swal.fire({
      text: "Please wait",
      imageUrl: "assets/gif/ajax-loading-gif.gif",
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.ticketSer.updateStatus(statusObj).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.ticketStatus1 = Swal.fire({
          icon: 'success',
          title: 'Done!',
          text: 'Status Updated Successfully!',
        });
      }
    }, (err: any) => {
      if(err) {
        this.ticketStatus0 = Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Status Updation failed',
          // timer: 3000,
        });
      };
    })
  }


 /* checkbox control */

  viewArray: any = [];
  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      this.dialog.open(this.viewTicketDialog)
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
      this.dialog.open(this.editTicketDialog)
    }
    this.CustomerReport();
  }

  EditByCheckbox(itemE: any, i: any, e: any) {
    var checked = (e.target.checked);
    // console.log("Edit By Checkbox:: ",itemE);
    // console.log("Edit Array::" ,this.editArray);
    // console.log("present in array : "+this.editArray.includes(itemE),  " checked : "+ checked)
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
    // console.log("Delete Multiple Records:: ", item);
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
    // console.log(this.deletearray)
  }

  deleteSelected() {
    if (this.selectedAll == false) {
      this.deletearray.forEach((el: any) => {
        // this.currentItem = el;
        // this.confirmDeleteRow();
        this.ticketData = this.ticketData.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.ticketData.forEach((el: any) => {
        this.ticketData = this.ticketData.filter((item: any) => item.siteId !== el.siteId);
      });
    }
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

}
