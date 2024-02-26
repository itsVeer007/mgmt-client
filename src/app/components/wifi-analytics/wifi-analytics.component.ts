import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { ChartService } from 'src/services/chart.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';


@Component({
  selector: 'app-wifi-analytics',
  templateUrl: './wifi-analytics.component.html',
  styleUrls: ['./wifi-analytics.component.css']
})
export class WifiAnalyticsComponent implements OnInit {


  showLoader = false;
  constructor(
    private inventorySer:InventoryService,
    private siteSer:SiteService,
    private assetSer: AssetService,
    private metaDatSer: MetadataService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    public alertSer: AlertService,
    private storageSer: StorageService,
    private chartService: ChartService
  ) { }


first:boolean = true;
second:boolean = false;
open(type:string) {
  // this.count();
  if(type == 'data') {
    this.second = true;
    this.first =false;
  }
  else
  this.first = true;
}

  tempSites:any;
  siteData: any;
  user: any;
  ngOnInit(): void {
    this.user =  this.storageSer.get('user');
    this.GetWifiStats();
  }


// Wifi Analytics
device:any;
active:any;
inActive:any;

wifiData: any = [];
newWifiData: any;
peakHours: any;
GetWifiStats() {
  this.showLoader = true;
  this.assetSer.devicefilter(null).subscribe((res:any)=> {
    console.log(res);
    this.showLoader = false;
    this.wifiData = res;
    this.newWifiData = this.wifiData;
  })
}

devicefilter(data:any) {
  console.log(data)
  this.assetSer.devicefilter(data).subscribe((res:any)=> {
    console.log(res);
  this.newWifiData = res
  })
}

viewData:any;
inputToChild: any;
@ViewChild('usedItemsDialog') usedItemsDialog = {} as TemplateRef<any>;
viewWifi(data: any) {
  // console.log(data);
  this.currentItem = data
  this.inputToChild = data;
  this.peakHours = data?.peakHours
  this.assetSer.GetWifiStats1({device_name: data?.device_name}).subscribe((res:any)=> {
    // console.log(res);
    this.viewData = res;
  });
  this.dialog.open(this.usedItemsDialog);
}



// newFilterData:any = []
filterData:any;
filterWifiData(data:any) {
  // console.log(data);
  this.assetSer.GetWifiStats({device_name: data?.device_name}).subscribe((res:any)=> {
    // console.log(res);
    this.newWifiData = res;
  })
}


secondTable:any
@ViewChild('usedItemsDialogTwo') usedItemsDialogTwo = {} as TemplateRef<any>;
secondView(data:any) {
  console.log(data)
  console.log(this.currentItem)
  let time = data?.hour?.split('-');
  let finalTime = time[0];
  this.assetSer.secondView({finalTime:finalTime, device: this.currentItem?.device_name}).subscribe((res)=> {
    console.log(res);
    this.secondTable = res;
  })
  this.dialog.open(this.usedItemsDialogTwo);
}



filterDataObject = {
  siteId: null,
  deviceId: null,
  startDate: null,
  endDate: null
}


// filterWifiData() {
//   this.showLoader = true;
//   this.assetSer.wifiData(this.filterDataObject).subscribe((res:any)=> {
//     // console.log(res);
//     this.total = res;
//     this.showLoader = false
//     this.newWifiData = res?.devices;
//   })
// }


openViewPopupData:any = [];
openWifiData(data: any) {

}

listSites() {
  this.showLoader = true;
  this.siteSer.listSites().subscribe((res: any) => {
    // console.log(res);
    this.showLoader = false;
    if(res?.Status == 'Success') {
      this.tableData = res?.siteList?.sort((a: any, b: any) => a.siteid < b.siteid ? -1 : a.siteid > b.siteid ? 1 : 0);
      this.newTableData = this.tableData;
      // console.log(this.newTableData)
    }
    }, (err: any) => {
      this.showLoader = false;
  });
}

siteSearch: any;
newTableData:any = [];
tableData:any = [];
filterSites(site: any) {
  if(site != 'All') {
    this.newTableData =  this.tableData.filter((item: any) => item.siteid == site)
  } else {
    this.newTableData = this.tableData;
  }
}

  frFilterBody: any = {
    p_frId: null,
    p_startdate:null,
    p_enddate:null
  }

  listSitesData: any
  reportsData:any = [];
  listFRReports() {
    this.frFilterBody.p_frId = this.user?.UserId;
    this.inventorySer.listFRReports(this.frFilterBody).subscribe((res: any)=> {
      // console.log(res);
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
  getMetadata() {
    let data = this.storageSer.get('metaData');
    for(let item of data) {
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

    this.inventorySer.filterTicket(myObj).subscribe((res: any) => {
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

  showWifiDetail: boolean = false;
  closenow(type: any) {
    if (type == 'wifi') {
      this.showWifiDetail = false;
    }
  }
  show(type: string) {
    if (type == 'wifi') {
      this.showWifiDetail = true
    }
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
    this.inventorySer.getTasks(item.ticketId).subscribe((tasks: any) => {
      // console.log(res);
      this.ticketTasks = tasks;
    });

    this.inventorySer.getTicketVisits(item.ticketId).subscribe((visits: any) => {
      // console.log(res);
      this.ticketVisits = visits;
    });

    this.inventorySer.getcomments(item.ticketId).subscribe((comments: any) => {
      this.ticketComments = comments;
    });

    // this.inventorySer.comment$.subscribe((cmt: any) => {
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

    this.inventorySer.assignTicket(myObj).subscribe((res: any) => {
      // console.log(res);
        this.alertSer.success(res?.message);
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
      'createdBy': this.user?.UserId
    }

    this.inventorySer.createComment(myObj).subscribe((res: any) => {
    this.inventorySer.comment$.next(res);
    });
    this.cmtValue = ''
  }

  @ViewChild('table', { static: false }) table!: ElementRef;
  generatePDF() {
    const doc = new jsPDF();
    const table = this.table.nativeElement;
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 10, 10, 190, 0);
      doc.save('table-data.pdf');
    });
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
