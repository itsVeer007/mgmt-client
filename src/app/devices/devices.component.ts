import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TicketService } from 'src/services/ticket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

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
  deviceData: any;
  CustomerReport() {
    this.http.get('assets/JSON/devicesData.json').subscribe((res: any) => {
      this.deviceData = res;
      // console.log(res)
    });
    // this.ticketSer.getTickets().subscribe((res: any) => {
    //   console.log(res);
    //   this.deviceData = res;
    // })
  }

  filterSiteId: any
  filterSiteId_Name(value: any) {
    this.filterSiteId = this.deviceData.filter((el: any) => el.siteId_Name == value)
  }

  filterDevice: any
  filterDeviceType(value: any) {
    this.filterDevice = this.deviceData.filter((el: any) => el.deviceType == value)
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
  // closenow(value:any) {
  //   this.showAddSite = value;
  // }

  closenow(value: any, type: String) {
    if (type == 'ticket') { this.showTicket = value; }

    // setTimeout(() => {
    //   var openform = localStorage.getItem('opennewform');
    //   if (openform == 'showAddSite') { this.showAddSite = true; }
    //   if (openform == 'showAddCamera') { this.showAddCamera = true; }
    //   if (openform == 'showAddCustomer') { this.showAddCustomer = true; }
    //   if (openform == 'showAddBusinessVertical') { this.showAddBusinessVertical = true; }
    //   if (openform == 'showAddUser') { this.showAddUser = true; }
    //   if (openform == 'additionalSite') { this.showSite = true; }
    //   localStorage.setItem('opennewform', '');
    // }, 100)
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
    for (var i = 0; i < this.deviceData.length; i++) {
      // console.log(this.deviceData[i])
      this.deviceData[i].selected = this.selectedAll;
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.deviceData.every(function (item: any) {
      // console.log(item)
      return item.selected == true;
    })
  }


  deleteRow: any;

  deleteRow1(item: any, i: any) {
    console.log("DELETEROW:: ", item);
    this.showLoader = true;
    setTimeout(() => {
      this.showLoader = false;
      this.deviceData.splice(i, 1);
    }, 1000);
  }

  deletePopup: boolean = true;
  currentItem: any;


  editPopup: boolean = true;
  originalObject: any;
  // changedKeys: any[] = [];

  openEditPopup(item: any, i: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.editPopup = false;
    console.log(this.currentItem);
  }

  // confirmEditRow(event: any) {
  //   this.originalObject = {
  //     "ticketId": this.currentItem.ticketId,
  //     "site": this.currentItem.site,
  //     "description": this.currentItem.description,
  //     "priority": this.currentItem.priority,
  //     "status": this.currentItem.status,
  //   };

  //   let x = event.target['name'];

  //   if(!(this.changedKeys.includes(x))) {
  //     this.changedKeys.push(x);
  //   }
  //   console.log(this.changedKeys);
  //   console.log(this.originalObject);
  //   console.log( this.currentItem);
  //   this.editPopup = true;
  //   this.CustomerReport();
  // }


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
      console.log(res);

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

  assignedObj = {
    assignedTo: ""
  }

  @ViewChild('assignedDialog') assignedDialog = {} as TemplateRef<any>;

  x: any
  openAssigned(item: any) {
    // console.log(item);
    this.x = item;
    this.dialog.open(this.assignedDialog);
  }

  toAssigned() {
    let myObj = {
      'ticketId': this.x.ticketId,
      'assignedTo': this.assignedObj.assignedTo
    }

    this.ticketSer.assignPerson(myObj).subscribe((res: any) => {
      console.log(res)
    })
  }

  @ViewChild('editStatusDialog') editStatusDialog = {} as TemplateRef<any>;

  y: any
  openEditStatus(id: any) {
    console.log(id);
    this.y = id;
    this.dialog.open(this.editStatusDialog);
  }

  staObj = {
    status: ""
  }


  changeAssetStatus() {
    let statusObj = {
      ticketId: this.y.ticketId,
      status: this.staObj.status
    }

    this.ticketSer.updateStatus(statusObj).subscribe((res: any) => {
      console.log(res);
    })
  }


  openDeletePopup(item: any, i: any) {
    this.currentItem = item;
    this.deletePopup = false;
    console.log(item);
  }

  confirmDeleteRow() {
    // console.log(this.currentItem);
    // this.deviceData = this.deviceData.filter((item: any) => item.siteId !== this.currentItem.siteId);
    this.deletePopup = true;

    this.ticketSer.deleteTicket(this.currentItem).subscribe((res: any) => {
      console.log(res);
    })
  }

  closeDeletePopup() {
    this.deletePopup = true;
  }

  closeEditPopup() {
    this.editPopup = true;
  }

  editArray: any = [];
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

  editBySelectedOne() {
    if (this.editArray.length > 0) {
      this.editPopup = false;
    }
    this.CustomerReport();
  }


  viewPopup: boolean = true;

  confirmViewRow() {
    console.log("ToBE Viewed:: ", this.currentItem);
    this.viewPopup = true;
  }

  closeViewPopup() {
    this.viewPopup = true;
  }

  openViewPopup(item: any, i: any) {
    this.currentItem = item;
    console.log("VIEW PAGE:: ", this.currentItem);
    this.viewPopup = false;
  }

  viewArray: any = [];
  ViewByCheckbox(itemV: any, i: any, e: any) {
    var checked = (e.target.checked);
    // console.log("View By Checkbox:: ",itemV);
    // console.log("View Array::" ,this.viewArray);
    // console.log("present in array : "+this.viewArray.includes(itemV),  " checked : "+ checked)
    if (checked == true && this.viewArray.includes(itemV) == false) {
      this.viewArray.push(itemV);
      this.currentItem = this.viewArray[(this.viewArray.length - 1)];
    }
    if (checked == false && this.viewArray.includes(itemV) == true) {
      this.viewArray.splice(this.viewArray.indexOf(itemV), 1)
    }
  }

  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      this.viewPopup = false;
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
        this.deviceData = this.deviceData.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.deviceData.forEach((el: any) => {
        this.deviceData = this.deviceData.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }


  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.deviceData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}