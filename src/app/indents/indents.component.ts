import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { IndentService } from 'src/services/indent.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { OrderService } from 'src/services/order.service';
import { ProductMasterService } from 'src/services/product-master.service';
import { VendorsService } from 'src/services/vendors.service';

@Component({
  selector: 'app-indents',
  templateUrl: './indents.component.html',
  styleUrls: ['./indents.component.css']
})
export class IndentsComponent implements OnInit {

  constructor(
    private indentSer: IndentService,
    private productMasterSer: ProductMasterService,
    private vendorSer: VendorsService,
    private inventorySer: InventoryService,
    private orderSer: OrderService,
    private metaDatSer: MetadataService,
    private alertSer: AlertService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listIndent();
    this.listOrderItems();
    this.onGetMetadata();
  }

  showLoader = false;
  showIconView: boolean = false;
  showIconEdit: boolean = false;
  showIconDelete: boolean = false;
  showIconView1: boolean = false;
  showIconEdit1: boolean = false;
  showIconDelete1: boolean = false;
  searchText: any;
  searchTx: any;
  indentTable: any = [];
  newIndentTable: any = [];

  orderItems: any = [];
  newOrderItems: any = [];
  active: any = [];

  productIds: any;
  vendorDetail: any;
  inventoryDetail: any;
  listIndent() {
    this.showLoader = true;
    this.indentSer.listIndent().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      this.indentTable = res;
      this.newIndentTable = this.indentTable;

      for(let item of this.indentTable) {
        if(item.statusId == 1) {
          this.active.push(item);
        }
      }
    });

    this.productMasterSer.listProduct().subscribe((res: any) => {
      this.productIds = res;
    })

    this.vendorSer.listVendors().subscribe((res: any) => {
      this.vendorDetail = res;
    })

    this.inventorySer.listInventory().subscribe((res: any) => {
      this.inventoryDetail = res;
    })
  }

  listOrderItems() {
    this.showLoader = true;
    this.orderSer.listOrderItems().subscribe((res: any) => {
      this.showLoader = false;
      this.orderItems = res;
      this.newOrderItems = this.orderItems;
    });
  }


  brandNames: any;
  categoryTypes: any;
  statusVal: any;
  removeDuplicates() {
    this.brandNames = this.indentTable.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.productBrand == current.productBrand);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.categoryTypes = this.indentTable.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.productCategory == current.productCategory);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.statusVal = this.indentTable.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.status == current.status);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
  }

  vendorStatus: any
  indentStatus: any
  onGetMetadata() {
    this.metaDatSer.getMetadata().subscribe((res: any) => {
      // console.log(res);
      for(let item of res) {
        if(item.type == 'Ticket_Status') {
          this.statusVal = item.metadata;
        } else if(item.type == "Vendor_Status") {
          this.vendorStatus = item.metadata;
        } else if(item.type == "Indent_Status") {
          this.indentStatus = item.metadata;
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
      this.newIndentTable = res;
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

  showInventory: boolean = false;
  closenow(value: any, type: String) {
    if (type == 'vendor') { this.showInventory = value; }
  }

  show(type: string) {
    if (type == 'vendor') { this.showInventory = true; }
  }


  currentItem: any;
  originalObject: any;
  changedKeys: any = [];

  /* view inventory */

  @ViewChild('viewInventoryDialog') viewInventoryDialog = {} as TemplateRef<any>;
  openViewPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.viewInventoryDialog, {maxWidth: '650px', maxHeight: '550px'});
    // console.log(this.currentItem);
  }


  /* update inventory */

  @ViewChild('editInventoryDialog') editInventoryDialog = {} as TemplateRef<any>;

  inventorySerial: any;
  openEditPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.editInventoryDialog, {maxWidth: '650px', maxHeight: '550px'});

    this.inventorySer.listInventoryByProductId(item.productId).subscribe((res: any) => {
      // console.log(res);
      for(let item of this.inventoryDetail) {
        if(item.inventoryStatusId == 1) {
          this.inventorySerial = res;
        }
      }
    })
  }

  updateInventoryId: any;
  updateIndent() {
    this.originalObject = {
      'id': this.currentItem.id,
      'statusId': this.currentItem.statusId,
      'updatedBy': 1,
      'inventoryId': this.updateInventoryId,
      'remarks': this.currentItem.remarks
    }

    // this.originalObject.inventoryId = null;
    this.alertSer.wait();
    this.indentSer.updateIndentStatus(this.originalObject).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res);
        this.listIndent();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error();
      };
    });
  }


  @ViewChild('deleteInventoryDialog') deleteInventoryDialog = {} as TemplateRef<any>;

  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteInventoryDialog, { maxWidth: '650px', maxHeight: '550px'});
  }

  deleteIndent() {
    this.alertSer.wait();
    this.indentSer.deleteIndent(this.currentItem).subscribe((res: any) => {
      if(res) {
        this.alertSer.success(res);
        this.listIndent();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error();
      };
    });
  }


  @ViewChild('createOrderDialog') createOrderDialog = {} as TemplateRef<any>;

  openCreateOrder() {
    // this.currentItem = item;
    this.dialog.open(this.createOrderDialog, { maxWidth: '650px', maxHeight: '550px'});
  }

  centralboxBody = {
    centralBoxId: null,
    inventoryId: null,
    createdBy: 1
  }

  addComponent() {
    this.indentSer.addComponent(this.centralboxBody).subscribe((res: any) => {
      // console.log(res)
    })
  }


  @ViewChild('replaceComponentDialog') replaceComponentDialog = {} as TemplateRef<any>;

  openReplaceComponent() {
    this.dialog.open(this.replaceComponentDialog, { maxWidth: '550px', maxHeight: '550px'});
  }

  body = {
    oldInventoryId: null,
    newInventoryId: null,
    replacedBy: 1
  }
  replaceComponent() {
    this.alertSer.wait();
    this.indentSer.replaceComponent(this.body).subscribe((res: any) => {
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


  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.indentTable;
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

  selectedAll: any;
  selectAll() {
    for (var i = 0; i < this.indentTable.length; i++) {
      this.indentTable[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.indentTable.every(function (item: any) {
      return item.selected == true;
    })
  }

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
      this.dialog.open(this.viewInventoryDialog, {maxWidth: '750px', maxHeight: '550px'})
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
      this.dialog.open(this.editInventoryDialog, {maxWidth: '750px', maxHeight: '550px'})
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
  }

  deleteSelected() {
    if (this.selectedAll == false) {
      this.deletearray.forEach((el: any) => {
        // this.currentItem = el;
        // this.deleteInventory();
        this.indentTable = this.indentTable.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.indentTable.forEach((el: any) => {
        this.indentTable = this.indentTable.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }

}
