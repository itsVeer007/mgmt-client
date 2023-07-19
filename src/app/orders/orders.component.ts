import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { OrderService } from 'src/services/order.service';
import { VendorsService } from 'src/services/vendors.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    var x = <HTMLElement>document.getElementById(`plus-img${this.currentid}`);
    // var y = <HTMLElement>document.getElementById(`address${this.addressid}`);

    // console.log(`plus-img${this.currentid}`);
    if (x != null) {
      if (!x.contains(e.target)) {
        if (x.style.display == 'flex' || x.style.display == 'block') {
          x.style.display = 'none';
        }
      }
    }

    // if (y != null) {
    //   if(!y.contains(e.target)) {
    //     if (y.style.display == 'flex' || y.style.display == 'block') {
    //       y.style.display = 'none';
    //     }
    //   }
    // }
  }




  showLoader = false;
  constructor(
    private http: HttpClient,
    private ass: AssetService,
    private inventorySer: InventoryService,
    private vendorSer: VendorsService,
    private orderSer: OrderService,
    private metaDatSer: MetadataService,
    private alertSer: AlertService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getVendors();
    this.getVendorr();
  }

  showIconView: boolean = false;
  showIconEdit: boolean = false;
  showIconDelete: boolean = false;
  showIconView1: boolean = false;
  showIconEdit1: boolean = false;
  showIconDelete1: boolean = false;

  searchText: any;
  searchTx: any;
  inventoryTable: any = [];
  newInventoryTable: any = [];

  active: any = [];
  inActive: any = [];
  getVendors() {
    this.showLoader = true;
    this.orderSer.listOrderItems().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;

      this.inventoryTable = res;
      this.newInventoryTable = this.inventoryTable;

      for(let item of this.inventoryTable) {
        if(item.statusId == 1) {
          this.active.push(item);
        } else if(item.statusId == 2) {
          this.inActive.push(item);
        }
      }
    });
  }

  vendorDetail: any;
  getVendorr() {
    this.vendorSer.listVendors().subscribe((res: any) => {
      // console.log(res);
      this.vendorDetail = res;
    })
  }


  brandNames: any;
  categoryTypes: any;
  statusVal: any;
  removeDuplicates() {
    this.brandNames = this.inventoryTable.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.productBrand == current.productBrand);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.categoryTypes = this.inventoryTable.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.productCategory == current.productCategory);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.statusVal = this.inventoryTable.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.status == current.status);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
  }

  vendorStatus: any
  onGetMetadata() {
    this.metaDatSer.getMetadata().subscribe((res: any) => {
      // console.log(res);
      for(let item of res) {
        if(item.type == 'Ticket_Status') {
          this.statusVal = item.metadata;
        } else if(item.type == "Vendor_Status") {
          this.vendorStatus = item.metadata;
        }
      }
    })
  }

  ovendorId: any = null;
  oinvoiceId: any = null;
  ostartDate: any = null;
  oendDate: any = null;

  applyFilter() {
    let myObj = {
      vendorId: this.ovendorId ? this.ovendorId : -1,
      InvoiceId: this.oinvoiceId ? this.oinvoiceId : '',
      startDate: this.ostartDate ? this.ostartDate : '',
      endDate: this.oendDate ? this.oendDate : '',
    }

    this.orderSer.filteBody(myObj).subscribe((res: any) => {
      this.newInventoryTable = res;
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

  closenow(value: any, type: String) {
    if (type == 'vendor') { this.showInventory = value; }
  }

  showInventory: boolean = false;

  show(type: string) {
    if (type == 'vendor') { this.showInventory = true; }
  }

  selectedAll: any;
  selectAll() {
    for (var i = 0; i < this.inventoryTable.length; i++) {
      this.inventoryTable[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.inventoryTable.every(function (item: any) {
      return item.selected == true;
    })
  }


  currentItem: any;
  originalObject: any;
  changedKeys: any = [];

  /* view inventory */

  @ViewChild('viewInventoryDialog') viewInventoryDialog = {} as TemplateRef<any>;
  openViewPopup(item: any) {
    this.currentItem = item;
    // this.dialog.open(this.viewInventoryDialog);
    this.dialog.open(this.viewInventoryDialog, {maxHeight: '550px', maxWidth: '750px'});
    // console.log(this.currentItem);
  }


  /* update inventory */

  @ViewChild('editInventoryDialog') editInventoryDialog = {} as TemplateRef<any>;
  openEditPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.editInventoryDialog, {maxHeight: '550px', maxWidth: '750px'});
    // console.log(item);
  }

  editInventory() {
    this.originalObject = {
      'id': this.currentItem.id,
      'invoiceNo': this.currentItem.invoiceNo,
      'by': 1,
      'remarks': this.currentItem.remarks
    }

    this.alertSer.wait();
    this.orderSer.updateOrder(this.originalObject).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res);
      }
      setTimeout(() => {
        // window.location.reload();
      }, 3000)
    }, (err: any) => {
      if(err) {
        this.alertSer.error();
      };
    });
  }


  @ViewChild('deleteInventoryDialog') deleteInventoryDialog = {} as TemplateRef<any>;

  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteInventoryDialog, {maxHeight: '550px', maxWidth: '750px'});
  }

  deleteInventory() {
    this.alertSer.wait();
    this.orderSer.deleteOrder(this.currentItem).subscribe((res: any) => {
      if(res) {
        this.alertSer.success(res);
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error();
      };
    });
  }


  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.inventoryTable;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  //Show Detail
  showDetail: boolean = false;

  onShowDetail() {
    this.showDetail = !this.showDetail
  }


 /* checkbox control */

  viewArray: any = [];
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

  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      this.dialog.open(this.viewInventoryDialog, {maxHeight: '550px', maxWidth: '750px'})
    }
  }

  editArray: any = [];
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

  editBySelectedOne() {
    if (this.editArray.length > 0) {
      this.dialog.open(this.editInventoryDialog, {maxHeight: '550px', maxWidth: '750px'})
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
        // this.deleteInventory();
        this.inventoryTable = this.inventoryTable.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.inventoryTable.forEach((el: any) => {
        this.inventoryTable = this.inventoryTable.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }

}
