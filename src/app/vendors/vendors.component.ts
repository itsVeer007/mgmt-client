import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { VendorsService } from 'src/services/vendors.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {

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
    private metaDatSer: MetadataService,
    private alertSer: AlertService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getVendors();
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
    this.vendorSer.listVendors().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;

      this.inventoryTable = res;
      this.newInventoryTable = this.inventoryTable;

      for(let item of this.inventoryTable) {
        if(item.statusId == 1) {
          this.active.push(item);
        }
      }
    });
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

  prBrand: any = null;
  sta: any = null;
  prCat: any = null;

  applyFilter() {
    let myObj = {
      productBrand: this.prBrand ? this.prBrand : '',
      status: this.sta ? this.sta : '',
      productCategory: this.prCat ? this.prCat : '',
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


  @ViewChild('itemsDialog') itemsDialog = {} as TemplateRef<any>;

  itemDetail: any
  itemsView(i: any) {
    this.vendorSer.listVendorsById(i.id).subscribe((res: any) => {
      this.itemDetail = res;
      this.dialog.open(this.itemsDialog, {maxWidth: '550px', maxHeight: '550px'});
    })
  }


  @ViewChild('proprietorDialog') proprietorDialog = {} as TemplateRef<any>;

  currentDetail: any;
  proprietorView(i: any) {
    this.currentDetail = i;
    this.dialog.open(this.proprietorDialog, {maxWidth: '550px', maxHeight: '550px'});
  }


  @ViewChild('addressDialog') addressDialog = {} as TemplateRef<any>;

  addressId: any;
  addressView(i: any) {
    this.addressId = i;
    this.dialog.open(this.addressDialog, {maxWidth: '550px', maxHeight: '550px'})
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
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.dialog.open(this.editInventoryDialog, {maxHeight: '550px', maxWidth: '750px'});
    console.log(item);
  }

  onInputChange(e: any) {
    this.originalObject = {
      'id': this.currentItem.id,
      'name': this.currentItem.name,
      'proprietorName1': this.currentItem.proprietorName1,
      'proprietorName2': this.currentItem.proprietorName2,
      'proprietorName3': this.currentItem.proprietorName3,
      'emailId1': this.currentItem.emailId1,
      'emailId2': this.currentItem.emailId2,
      'emailId3': this.currentItem.emailId3,
      'mobileNumber1': this.currentItem.mobileNumber1,
      'mobileNumber2': this.currentItem.mobileNumber2,
      'mobileNumber3': this.currentItem.mobileNumber3,
      'statusId': this.currentItem.statusId,
      'serviceStartDate': null,
      'serviceEndDate': this.currentItem.serviceEndDate,
      'createdBy': null,
      'modifiedBy': 0,
      'createdTime': null,
      'modifiedTime': null,
      'addressLine1': this.currentItem.addressLine1,
      'addressLine2': this.currentItem.addressLine2,
      'postCode': this.currentItem.postCode,
      'country': this.currentItem.country,
      'state': this.currentItem.state,
      'city': this.currentItem.city,
      'remarks': this.currentItem.remarks
    };

    let x = e.target['name'];

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onSelectChange(e: any) {
    this.originalObject = {
      'id': this.currentItem.id,
      'name': this.currentItem.name,
      'proprietorName1': this.currentItem.proprietorName1,
      'proprietorName2': this.currentItem.proprietorName2,
      'proprietorName3': this.currentItem.proprietorName3,
      'emailId1': this.currentItem.emailId1,
      'emailId2': this.currentItem.emailId2,
      'emailId3': this.currentItem.emailId3,
      'mobileNumber1': this.currentItem.mobileNumber1,
      'mobileNumber2': this.currentItem.mobileNumber2,
      'mobileNumber3': this.currentItem.mobileNumber3,
      'statusId': this.currentItem.statusId,
      'serviceStartDate': null,
      'serviceEndDate': this.currentItem.serviceEndDate,
      'createdBy': null,
      'modifiedBy': 0,
      'createdTime': null,
      'modifiedTime': null,
      'addressLine1': this.currentItem.addressLine1,
      'addressLine2': this.currentItem.addressLine2,
      'postCode': this.currentItem.postCode,
      'country': this.currentItem.country,
      'state': this.currentItem.state,
      'city': this.currentItem.city,
      'remarks': this.currentItem.remarks
    };

    let x = e.source.ngControl.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  editInventory() {
    this.originalObject = {
      'id': this.currentItem.id,
      'name': this.currentItem.name,
      'proprietorName1': this.currentItem.proprietorName1,
      'proprietorName2': this.currentItem.proprietorName2,
      'proprietorName3': this.currentItem.proprietorName3,
      'emailId1': this.currentItem.emailId1,
      'emailId2': this.currentItem.emailId2,
      'emailId3': this.currentItem.emailId3,
      'mobileNumber1': this.currentItem.mobileNumber1,
      'mobileNumber2': this.currentItem.mobileNumber2,
      'mobileNumber3': this.currentItem.mobileNumber3,
      'statusId': this.currentItem.statusId,
      'serviceStartDate': null,
      'serviceEndDate': this.currentItem.serviceEndDate,
      // 'createdBy': null,
      'modifiedBy': 0,
      'createdTime': null,
      'modifiedTime': null,
      'addressLine1': this.currentItem.addressLine1,
      'addressLine2': this.currentItem.addressLine2,
      'postCode': this.currentItem.postCode,
      'country': this.currentItem.country,
      'state': this.currentItem.state,
      'city': this.currentItem.city,
      'remarks': this.currentItem.remarks
    }

    this.alertSer.wait();
    this.vendorSer.updatevendor({vendor: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
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

  deleteVendor() {
    this.alertSer.wait();
    this.vendorSer.deleteVendor(this.currentItem).subscribe((res: any) => {
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
