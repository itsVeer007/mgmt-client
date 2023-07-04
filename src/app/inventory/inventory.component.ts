import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {


  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    var x = <HTMLElement>document.getElementById(`plus-img${this.currentid}`);
    var y = <HTMLElement>document.getElementById(`address${this.addressid}`);

    // console.log(`plus-img${this.currentid}`);
    if (x != null) {
      if (!x.contains(e.target)) {
        if (x.style.display == 'flex' || x.style.display == 'block') {
          x.style.display = 'none';
        }
      }
    }

    if (y != null) {
      if(!y.contains(e.target)) {
        if (y.style.display == 'flex' || y.style.display == 'block') {
          y.style.display = 'none';
        }
      }
    }
  }




  showLoader = false;
  constructor(
    private http: HttpClient,
    private ass: AssetService,
    private inventorySer: InventoryService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    private metadataSer: MetadataService,
    private alertSer: AlertService
    ) { }

  ngOnInit(): void {
    this.getInventory();
    this.onMetadataChange();
  }

  // showIconVertical: boolean = false;
  // showIconCustomer: boolean = false;
  // showIconSite: boolean = false;
  // showIconCamera: boolean = false;
  // showIconAnalytic: boolean = false;
  // showIconUser: boolean = false;

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

  installed: any = [];
  inStock: any = [];
  scrap: any = [];
  redyToUse: any = [];
  getInventory() {
    this.inventorySer.getListing().subscribe((res: any) => {
      // console.log(res);
      this.inventoryTable = res;
      this.newInventoryTable = this.inventoryTable;

      for(let item of this.inventoryTable) {
        if(item.status == 'Installed') {
          this.installed.push(item);
        } else if(item.status == 'In-Stock') {
          this.inStock.push(item);
        } else if(item.status == 'Scrap') {
          this.scrap.push(item);
        } else if(item.status == 'ReadyToReuse') {
          this.redyToUse.push(item);
        }
      }
    });
  }

  warrDetail: any
  getWarranty(id: any) {
    this.inventorySer.getWarranty(id).subscribe((res: any) => {
      console.log(res);
      this.warrDetail = res;

    })
  }

  // filterBrand(val: any) {
  //   if(val == 'none') {
  //     this.newInventoryTable = this.inventoryTable;
  //   } else {
  //     this.newInventoryTable = this.inventoryTable.filter((el: any) => el.productBrand == val);
  //   }
  // }

  // filterCategory(val: any) {
  //   if(val == 'none') {
  //     this.newInventoryTable = this.inventoryTable;
  //   } else {
  //     this.newInventoryTable = this.inventoryTable.filter((el: any) => el.productCategory == val);
  //   }
  // }

  // filterStatus(val: any) {
  //   if(val == 'none') {
  //     this.newInventoryTable = this.inventoryTable;
  //   } else {
  //     this.newInventoryTable = this.inventoryTable.filter((el: any) => el.status == val);
  //   }
  // }


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

    /* metadata methods */

    inventoryStatus: any;
    onMetadataChange() {
      this.metadataSer.getMetadata().subscribe((res: any) => {
        for(let item of res) {
          if(item.type == 'Inventory_Status') {
            this.inventoryStatus = item.metadata;
          }
        }
      })
    }

  prName: any = null;
  prStatus: any = '';
  prCreatedTime: any = null;
  prCreatedTime1: any = null;

  applyFilter() {
    let myObj = {
      'name': this.prName ? this.prName : '',
      'statusId': this.prStatus ? this.prStatus : '',
      'createdTime': this.prCreatedTime ? this.datepipe.transform(this.prCreatedTime, 'yyyy-MM-ddThh-MM-ss') : '',
      'createdTime1': this.prCreatedTime1 ? this.datepipe.transform(this.prCreatedTime1, 'yyyy-MM-ddThh-MM-ss') : ''
    }

    // console.log(myObj)

    this.inventorySer.filteBody(myObj).subscribe((res: any) => {
      // console.log(res);
      this.newInventoryTable = res;
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

  closenow(value: any, type: String) {
    if (type == 'inventory') { this.showInventory = value; }
  }

  showInventory: boolean = false;

  show(type: string) {
    if (type == 'inventory') { this.showInventory = true; }
  }

  addressid = 0;
  addressView(e: any, i: any) {
    this.addressid = i;
    var x = e.target.nextElementSibling;
    // console.log("AddressView:: ",x)
    if (x.style.display == 'none') {
      x.style.display = 'flex';
    } else {
      x.style.display = 'none';
    }
    // this.address = !this.address;
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

  /* view warranty */

  @ViewChild('viewWarrantyDialog') viewWarrantyDialog = {} as TemplateRef<any>;

  viewWarrantyPopup() {
    // this.currentItem = item;
    this.dialog.open(this.viewWarrantyDialog, {maxHeight: '550px', maxWidth: '550px'});
    // console.log(this.currentItem);
  }

  /* view inventory */

  @ViewChild('viewInventoryDialog') viewInventoryDialog = {} as TemplateRef<any>;

  openViewPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.viewInventoryDialog, {maxHeight: '550px', maxWidth: '550px'});
    // console.log(this.currentItem);
  }

  /* update inventory */

  @ViewChild('editInventoryDialog') editInventoryDialog = {} as TemplateRef<any>;

  openEditPopup(item: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.dialog.open(this.editInventoryDialog, {maxHeight: '550px', maxWidth: '550px'});
    // console.log(item);
  }

  editInventory() {
    // console.log(this.currentItem);
    // this.inventoryTable= this.inventoryTable.filter((item:any) => item.siteId !== this.currentItem.siteId);
    // this.getInventory();

    this.originalObject = {
      "id": this.currentItem.id,
      "quantity": this.currentItem.quantity,
      "serialNo": this.currentItem.serialNo,
      "cost": this.currentItem.cost,
      "price": this.currentItem.price,
      "modifiedBy": 1,
      "modifiedTime": null,
      "statusId": this.currentItem.statusId,
      "remarks": this.currentItem.remarks
    }
    this.alertSer.wait();

    this.inventorySer.UpdateInventory(this.originalObject).subscribe((res: any) => {
      // console.log(res);

      if(res) {
        this.alertSer.success(res);
      }
      setTimeout(() => {
        window.location.reload();
      }, 3000)
    },
    (err: any) => {
      if(err) {
        this.alertSer.error();
      };
    });
  }

  @ViewChild('editWarrantyDialog') editWarrantyDialog = {} as TemplateRef<any>;

  openWarrantyPopup(item: any) {
    this.dialog.open(this.editWarrantyDialog, {maxHeight: '550px', maxWidth: '550px'});

    this.inventorySer.getWarranty(item.id).subscribe((res: any) => {
      // console.log(res);
      this.currentItem = res;
    })
    // console.log(this.currentItem);
  }

  editWarranty() {
    // console.log(this.currentItem);
    // this.inventoryTable= this.inventoryTable.filter((item:any) => item.siteId !== this.currentItem.siteId);
    // this.getWarranty();

    this.originalObject = {
      "id": this.currentItem.id,
      "serialNo": this.currentItem.serialNo,
      "newSerialNo": this.currentItem.newSerialNo,
      "cost": this.currentItem.cost,
      "startDate": this.currentItem.startDate,
      "endDate": this.currentItem.endDate,
      "statusId": this.currentItem.statusId,
      "modifiedBy":  1,
      "modifiedTime": null,
      "remarks": this.currentItem.remarks
    }
    this.alertSer.wait();

    this.inventorySer.UpdateWarranty(this.originalObject).subscribe((res: any) => {
      // console.log(res);

      if(res) {
        this.alertSer.success(res);
      }
      setTimeout(() => {
        window.location.reload();
      })
    },
    (err: any) => {
      if(err) {
        this.alertSer.wait();
      };
    });
  }




  // deleteRow: any;
  // deleteRow1(item: any, i: any) {
  //   this.showLoader = true;
  //   setTimeout(() => {
  //     this.showLoader = false;
  //     this.inventoryTable.splice(i, 1);
  //   }, 1000);
  // }


  @ViewChild('deleteInventoryDialog') deleteInventoryDialog = {} as TemplateRef<any>;

  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteInventoryDialog, {maxHeight: '250px', maxWidth: '250px'});
    // console.log("Selected Item:: ", item);
  }

  deleteInventory() {
    // console.log(this.currentItem);
    // this.inventoryTable = this.inventoryTable.filter((item: any) => item.siteId !== this.currentItem.siteId);

    this.alertSer.wait();
    this.inventorySer.deleteInventory(this.currentItem).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res);
      }
      setTimeout(() => {
        window.location.reload();
      }, 3000)
    },
    (err: any) => {
      if(err) {
        this.alertSer.error();
      };
    });
  }


/* checkbox control */

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
      this.dialog.open(this.viewInventoryDialog, {maxHeight: '550px', maxWidth: '550px'});
    }
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
      this.dialog.open(this.editInventoryDialog, {maxHeight: '550px', maxWidth: '550px'});
    }
    this.getInventory();
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

}
