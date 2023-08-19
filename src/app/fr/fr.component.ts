import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { TicketService } from 'src/services/ticket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fr',
  templateUrl: './fr.component.html',
  styleUrls: ['./fr.component.css']
})
export class FrComponent implements OnInit {

  constructor(
    private ticketSer: TicketService,
    public dialog: MatDialog,
    private inventorySer: InventoryService,
    private metaDatSer: MetadataService,
    public alertSer: AlertService
    ) { }

  ngOnInit(): void {
    // this.listFRSites();
    this.listFRTickets();
    this.onGetMetadata();
  }

  frTickets: any
  listFRTickets() {
    this.ticketSer.listFRTickets().subscribe((res: any) => {
      // console.log(res);
      this.frTickets = res;
    })
  }

  assignedTo: any;
  taskStatus: any;
  sourceOfRequest: any;
  indentStatus: any;
  onGetMetadata() {
    this.metaDatSer.getMetadata().subscribe((res: any) => {
      // console.log(res);
      for(let item of res) {
        if(item.type == "Assigned_To") {
          this.assignedTo = item.metadata;
        } else if(item.type == "Task_Status") {
          this.taskStatus = item.metadata;
        } else if(item.type == "Source_of_Request") {
          this.sourceOfRequest = item.metadata;
        } else if(item.type == "Indent_Status") {
          this.indentStatus = item.metadata;
        }
      }
    })
  }

  showIndent: boolean = false;
  show(type: string) {
    if (type == 'indent') { this.showIndent = true }
  }
  closenow(type: String) {
    if (type == 'indent') { this.showIndent = false }
  }

  ticketIdToFr(ticketId: any) {
    localStorage.setItem('ticketId', JSON.stringify(ticketId));
  }

  @ViewChild('ticketTaskDialog') ticketTaskDialog = {} as TemplateRef<any>;
  ticketTasks: any;
  ticketVisits: any;
  ticketComments: any = [];
  openTicketTaskDialog(item: any) {
    this.dialog.open(this.ticketTaskDialog, {maxHeight: '550px', maxWidth: '850px'});
    this.ticketSer.getTasks(item.ticketId).subscribe((tasks: any) => {
      this.ticketTasks = tasks;
    });
  }

  @ViewChild('viewSitesDialog') viewSitesDialog = {} as TemplateRef<any>;

  openSitesDialog() {
    this.dialog.open(this.viewSitesDialog, {maxWidth: '550px', maxHeight: '550px'});
    this.listFRSites();
  }

  sites: any
  listFRSites() {
    this.ticketSer.listFRSites(1565).subscribe((res: any) => {
      // console.log(res);
      this.sites = res;
    })
  }


  fieldVisitEntry(item: any) {
    let myObj = {
      'frId': 1565,
      'siteId': item
    }

    this.ticketSer.fieldVisitEntry(myObj).subscribe((res: any) => {

      console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `${res.message}`,
      });
    }, (err: any) => {
      Swal.fire({
        icon: 'warning',
        title: 'Failed!',
        text: `${err.error.message}`,
      });
    })
  }


  @ViewChild('tasksDialog') tasksDialog = {} as TemplateRef<any>;

  tasks: any = [];
  openTasksDialog() {
    this.dialog.open(this.tasksDialog, {maxWidth: '750px', maxHeight: '550px'});
    this.ticketSer.listFRTasksOfCurrentVisit(1565).subscribe((res: any) => {
      // console.log(res);
      this.tasks = res;
    })
  }

  assignedObj = {
    statusId: null,
    remarks: null
  }

  @ViewChild('assignedDialog') assignedDialog = {} as TemplateRef<any>;

  currentTask: any;
  openTaskStatus(item: any) {
    this.currentTask = item;
    // this.dialog.open(this.assignedDialog, {maxWidth: '550px', maxHeight: '250px'});
  }


  @ViewChild('viewDetailsDialog') viewDetailsDialog = {} as TemplateRef<any>;

  indentItems: any;
  openDetailsDialog(item: any) {
    console.log(item)
    this.dialog.open(this.viewDetailsDialog, {maxWidth: '550px', maxHeight: '550px'});
    this.inventorySer.listIndentItems(item).subscribe((res: any) => {
      this.indentItems = res;
    })
  }

  @ViewChild('editStatusDialog') editStatus = {} as TemplateRef<any>;

  currentId: any = null;
  openEditStatus(id: any) {
    this.dialog.open(this.editStatus);
    this.currentId = id;
    // console.log(id);
  }

  statusObj = {
    // id: this.currentId,
    statusId: null,
    createdBy: 1565
  }
  updateInventoryStatus() {
    this.alertSer.wait();

    this.ticketSer.updateIndentStatus(this.currentId, this.statusObj).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res);
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error();
      };
    });
  }

  @ViewChild('createOrderDialog') createOrderDialog = {} as TemplateRef<any>;

  openCreateOrder(item: any) {
    // this.currentItem = item;
    this.dialog.open(this.createOrderDialog, { maxWidth: '650px', maxHeight: '550px'});
    this.inventorySer.listIndentItems(item).subscribe((res: any) => {
      this.indentItems = res;
    })
  }

  centralboxBody = {
    centralBoxId: null,
    inventoryId: null,
    createdBy: 1
  }

  addComponent() {
    this.inventorySer.addComponent(this.centralboxBody).subscribe((res: any) => {
      // console.log(res)
    })
  }

  @ViewChild('replaceComponentDialog') replaceComponentDialog = {} as TemplateRef<any>;

  inventoryId: any;
  inventoryId2: any;
  openReplaceComponent(data: any) {
    this.dialog.open(this.replaceComponentDialog, { maxWidth: '550px', maxHeight: '550px'});
    this.inventoryId2 = data;
    console.log(this.inventoryId2)

    this.inventorySer.listInventoryByItemCode(data).subscribe((res: any) => {
      // console.log(res)
      this.inventoryId = res;
    })
  }

  body = {
    oldInventoryId: null,
    newInventoryId: null,
    replacedBy: 1
  }
  replaceComponent() {
    // this.body.newInventoryId = this.inventoryId2?.inventoryId;
    this.alertSer.wait();
    this.inventorySer.replaceComponent(this.body).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res);
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error();
      };
    });
  }

  @ViewChild('cnfrmStatusDialog') cnfrmStatusDialog = {} as TemplateRef<any>;

  currentStatusItem: any;
  currentStatusType: any;
  openCnfrmStatusDialogt(item: any, type: any) {
    this.currentStatusItem = item;
    this.currentStatusType = type
    this.dialog.open(this.cnfrmStatusDialog, {maxWidth: '550px', maxHeight: '550px'});
  }

  logTaskStatus(item: any, status: any) {
    // console.log(status)
    // this.alertSer.wait();
    let myObj = {
      'taskId': item.id,
      'statusId': status,
      'fieldVisitId': item.fieldVisitId,
      'changedBy': 1565,
      'remarks': '',
    }

    this.ticketSer.logTaskStatus(myObj).subscribe((res: any) => {
      // console.log(res)
      if(res) {
        this.alertSer.success(res);
      }
      setTimeout(() => {
        // window.location.reload();
      }, 2000)
    }, (err: any) => {
        if(err) {
          // this.alertSer.error();
        }
    })
  }

  fieldExitBody = {
    frId: 1565,
    // travelAllowance: null,
    // foodAllowance: null,
    otherAllowance: null,
    remarks: null
  }

  @ViewChild('exitDialog') exitDialog = {} as TemplateRef<any>;

  openVisitExit() {
    this.dialog.open(this.exitDialog, {maxWidth: '550px', maxHeight: '550px'});
  }

  fieldVisitExit() {
    this.ticketSer.fieldVisitExit(this.fieldExitBody).subscribe((res: any) => {
      // console.log(res);
      this.alertSer.success(res);
    })
  }

}
