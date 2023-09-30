import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';

@Component({
  selector: 'app-fr',
  templateUrl: './fr.component.html',
  styleUrls: ['./fr.component.css']
})
export class FrComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private inventorySer: InventoryService,
    private metaDatSer: MetadataService,
    public alertSer: AlertService
    ) { }

  showLoader: boolean = false;
  siteIds: any;
  searchText: any;
  ngOnInit(): void {
    // this.listFRSites();
    this.listFRTickets();
    this.onGetMetadata();
    this.siteIds = JSON.parse(localStorage.getItem('siteIds')!)?.sort((a: any, b: any) => a.siteid < b.siteid ? -1 : a.siteid > b.siteid ? 1 : 0);
  }

  frTickets: any = [];
  newFrTickets: any = [];
  errMsg: any = null;
  listFRTickets() {
    this.showLoader = true;
    this.inventorySer.listFRTickets().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      this.frTickets = res;
      this.newFrTickets = this.frTickets;
      if(this.frTickets?.length == 0) {
        this.errMsg = 'No tickets'
      }
    }, (err: any) => {
      // console.log(err);
      this.showLoader = false;
      if(err?.status == 0) {
        this.errMsg = 'Connection timed out';
      } else {
        this.errMsg = err?.message;
      }
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

  siteNg: any;
  filterSites(site: any) {
    if(site == 'All') {
      this.newFrTickets = this.frTickets;
    } else {
      this.newFrTickets =  this.frTickets.filter((item: any) => item.sitename == site);

    }
  }

  showIndent: boolean = false;
  show(type: string) {
    if (type == 'indent') {
      this.showIndent = true
    }
  }
  closenow(type: String) {
    if (type == 'indent') {
      this.showIndent = false
      }
  }

  ticketIdToFr(ticketId: any) {
    localStorage.setItem('ticketId', JSON.stringify(ticketId));
  }


  statusItems: any;
  @ViewChild('statusItemsDialog') statusItemsDialog = {} as TemplateRef<any>;
  openStatusItems(type: any, status: any) {
    this.dialog.open(this.statusItemsDialog);
    this.inventorySer.listFRItems(type, status).subscribe((res: any) => {
      // console.log(res);
      this.statusItems = res;
      this.removeDuplicatesAndCalculateQuantities();

      if(status == 5) {
        this.latestValue = this.statusItems
      }
    })
  }

  latestFun(type: any, status: any) {
    this.inventorySer.listFRItems(type, status).subscribe((res: any) => {
      this.statusItems = res;
    })
  }

  @ViewChild('ticketTaskDialog') ticketTaskDialog = {} as TemplateRef<any>;
  ticketTasks: any;
  ticketVisits: any;
  ticketComments: any = [];
  openTicketTaskDialog(item: any) {
    this.dialog.open(this.ticketTaskDialog);
    this.inventorySer.getTasks(item.ticketId).subscribe((tasks: any) => {
      this.ticketTasks = tasks;
    });
  }

  @ViewChild('viewSitesDialog') viewSitesDialog = {} as TemplateRef<any>;

  sites: any
  openSitesDialog() {
    // this.dialog.open(this.viewSitesDialog);

    this.inventorySer.listFRSites(1565).subscribe((res: any) => {
      // console.log(res);
      this.sites = res;
    })
  }


  fieldVisitEntry(item: any) {
    this.inventorySer.fieldVisitEntry(item).subscribe((res: any) => {
      // console.log(res);
      this.alertSer.snackSuccess('Entry Successful');
    }, (err: any) => {
      this.alertSer.error(err?.error?.message);
    })
  }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.frTickets;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  sort1(label: any) {
    this.sorted = !this.sorted;
    var y = this.indentItems;
    if (this.sorted == false) {
      y.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      y.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  sort2(label: any) {
    this.sorted = !this.sorted;
    var y = this.tasks;
    if (this.sorted == false) {
      y.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      y.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }


  @ViewChild('currentTasksDialog') currentTasksDialog = {} as TemplateRef<any>;

  tasks: any = [];
  ticketType: any;
  currentSite: any;
  openTasksDialog(data: any) {
    // console.log(data);
    this.ticketType = data?.typeId;
    this.currentSite = data?.siteId;
    this.dialog.open(this.currentTasksDialog);
    this.inventorySer.listFRTasksOfCurrentVisit(1565).subscribe((res: any) => {
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
    // this.dialog.open(this.assignedDialog);
  }


  @ViewChild('viewIndentDialog') viewIndentDialog = {} as TemplateRef<any>;

  indentItems: any = [];
  openDetailsDialog(item: any) {
    // console.log(item);
    this.dialog.open(this.viewIndentDialog);
    this.inventorySer.listIndentItems(item).subscribe((res: any) => {
      // console.log(res);
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
    // this.alertSer.wait();

    this.inventorySer.updateIndentStatus1(this.currentId, this.statusObj).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.snackSuccess(res?.message);
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }

  @ViewChild('replaceDialog') replaceDialog = {} as TemplateRef<any>;

  openCreateOrder(item: any) {
    // console.log(item)
    // this.currentItem = item;
    this.dialog.open(this.replaceDialog, { maxWidth: '650px', maxHeight: '550px'});
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

  @ViewChild('replaceStatusDialog') replaceStatusDialog = {} as TemplateRef<any>;

  inventoryId: any;
  inventoryId2: any;
  openReplaceComponent(data: any) {
    // console.log(data)
    this.dialog.open(this.replaceStatusDialog, { maxWidth: '550px', maxHeight: '550px'});
    // this.inventoryId2 = data; imp
    // console.log(this.inventoryId2)

    // this.inventorySer.listInventoryByItemCode(data).subscribe((res: any) => {
    //   console.log(res)
    //   this.inventoryId = res;
    // });

    this.inventorySer.getItemsList(data).subscribe((res: any) => {
      // console.log(res);
      this.inventoryId = res;
    });

    this.inventorySer.listIndentItems(data).subscribe((res: any) => {
      // console.log(res);
      this.inventoryId2 = res;
    })
  }

  body = {
    oldInventoryId: null,
    newInventoryId: null,
    replacedBy: 1
  }

  body1 = {
    // oldInventoryId: null,
    newInventoryId: null,
    replacedBy: 1,
    siteId: null
  }

  replaceComponent() {
    // this.body.newInventoryId = this.inventoryId2?.inventoryId;
    // this.alertSer.wait();
    // this.body1.newInventoryId = indentItems
    this.inventorySer.replaceComponent(this.body).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.snackSuccess(res?.message);
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
      };
    });
  }

  statusMsg: string = '';
  changeToInstall(data: any) {
    this.body1.siteId = this.currentSite;
    this.body1.newInventoryId = data?.inventoryId;
    this.inventorySer.replaceComponent(this.body1).subscribe((res: any) => {
      // console.log(res);
      if(res?.statusCode == 200) {
        this.statusMsg = 'Installed'
      }
    })
  }

  @ViewChild('cnfrmStatusDialog') cnfrmStatusDialog = {} as TemplateRef<any>;

  currentStatusItem: any;
  currentStatusType: any;
  openCnfrmStatusDialogt(item: any, type: any) {
    this.currentStatusItem = item;
    this.currentStatusType = type
    this.dialog.open(this.cnfrmStatusDialog);
  }

  logTaskStatus(item: any, status: any) {
    let myObj = {
      'taskId': item.id,
      'statusId': status,
      'fieldVisitId': item.fieldVisitId,
      'changedBy': 1565,
      'remarks': '',
    }
    this.inventorySer.logTaskStatus(myObj).subscribe((res: any) => {
      // console.log(res)
      this.alertSer.snackSuccess(res?.message);
      this.inventorySer.listFRTasksOfCurrentVisit(1565).subscribe((res: any) => {
        // console.log(res);
        this.tasks = res;
      })
    }, (err: any) => {
        if(err) {
          // this.alertSer.error(err?.error?.message);
        }
    })
  }

  fieldExitBody = {
    frId: 1565,
    travelAllowance: null,
    foodAllowance: null,
    otherAllowance: null,
    remarks: null
  }

  @ViewChild('exitDialog') exitDialog = {} as TemplateRef<any>;

  openVisitExit() {
    this.dialog.open(this.exitDialog);
  }

  fieldVisitExit() {
    this.inventorySer.fieldVisitExit(this.fieldExitBody).subscribe((res: any) => {
      // console.log(res);
      this.alertSer.snackSuccess(res?.message);
    })
  }

  latestValue: any = [];
  removeDuplicatesAndCalculateQuantities() {
    const itemMap = new Map();
    for (const item of this.statusItems) {
      const key = item.itemCode;
      if (itemMap.has(key)) {
        itemMap.get(key).invNo += item.invNo;
        itemMap.get(key).count += 1;
      } else {
        itemMap.set(key, { ...item, count: 1 });
      }
    }

    this.latestValue = Array.from(itemMap.values());
  }

  // @ViewChild('viewInventoryToDispatch') viewInventoryToDispatch = {} as TemplateRef<any>
  currentItem:any;
  cost:any;
  @ViewChild ('dcChallan') dcChallan = {} as TemplateRef<any>;
  updateDispatchToInventory() {
    this.dialog.open(this.dcChallan);

    let obj = {
      oldSlNo: this.arr,
      dcNumber: this.cost
    }
    this.inventorySer.updateDispatchToInventory(obj).subscribe((res:any)=>{
      // console.log(res);
        this.alertSer.snackSuccess(res?.message);
    }),(err: any) => {
        this.alertSer.error(err?.error?.message);
    }


  }

  // dcDialog
  @ViewChild('viewDcDialog') viewDcDialog = {} as TemplateRef<any>
  items:any;
  openDc() {
    this.dialog.open(this.viewDcDialog);

    this.inventorySer.listDC().subscribe((res:any)=>{
      // console.log(res);
      this.items = res;
    })
  }

  Items:any;
  @ViewChild('dcStatusDialog') dcStatusDialog = {} as TemplateRef<any>
  dcItems() {
  this.dialog.open(this.dcStatusDialog)
    this.inventorySer.listDCItems().subscribe((res:any)=>{
      // console.log(res);
      this.Items = res;
    })
  }


  data = {
    receiptNo:null,
    cost:null,
    dcNumber:null
  }


  @ViewChild('dcFinalDialog') dcFinalDialog = {} as TemplateRef<any>
  openPopUp(item:any){
    this.dialog.open(this.dcFinalDialog)
    // this.inventorySer.updateDC(this.data).subscribe((res:any)=>{
    this.currentItem= item;
    // })
  }

  updateDC(){
    // this.data.dcNumber=this.currentItem.dcNumber
    // this.inventorySer.updateDC(this.data).subscribe((res:any)=>{
    //   this.alertSer.snackSuccess(res?.message)
    // }, (error)=>{
    //   this.alertSer.error(error?.err?.res);
    // })
  }



  selectedAll: any;
  arr: any = [];
  selectAll() {
    for (var i = 0; i < this.latestValue.length; i++) {
      this.latestValue[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected(current: any, e: any) {
    let x = e?.srcElement?.checked;
    if(x == true) {
      this.arr.push(current?.invNo)
      // console.log(this.arr);
    } else {
      this.arr.splice(this.arr.indexOf(current), 1);
      // console.log(this.arr);
    }

    this.selectedAll = this.latestValue.every(function (item: any) {
      return item.selected == true;
    })
  }

}
