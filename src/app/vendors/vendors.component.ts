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
    this.getInventory();
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
    this.vendorSer.getvendors().subscribe((res: any) => {
      // console.log(res);

      this.inventoryTable = res;
      this.newInventoryTable = this.inventoryTable;

      // for(let item of this.inventoryTable) {
      //   if(item.status == 'Installed') {
      //     this.installed.push(item);
      //   } else if(item.status == 'In-Stock') {
      //     this.inStock.push(item);
      //   } else if(item.status == 'Scrap') {
      //     this.scrap.push(item);
      //   } else if(item.status == 'ReadyToReuse') {
      //     this.redyToUse.push(item);
      //   }
      // }
    });
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
    if (type == 'inventory') { this.showInventory = value; }
  }

  showInventory: boolean = false;

  show(type: string) {
    if (type == 'inventory') { this.showInventory = true; }
  }

  @ViewChild('proprietorDialog') proprietorDialog = {} as TemplateRef<any>;

  proprietorId: any;
  proprietorView(i: any) {
    this.proprietorId = i;
    this.emailId = i;
    this.mobileId = i;
    // var x = e.target.nextElementSibling;
    // if (x.style.display == 'none') {
    //   x.style.display = 'flex';
    // } else {
    //   x.style.display = 'none';
    // }

    this.dialog.open(this.proprietorDialog, {maxHeight: '550px', maxWidth: '550px'});
  }

  @ViewChild('emailDialog') emailDialog = {} as TemplateRef<any>;
  emailId: any;
  emailView(i: any) {
    this.emailId = i;
    this.dialog.open(this.emailDialog)
  }

  @ViewChild('mobileDialog') mobileDialog = {} as TemplateRef<any>;
  mobileId: any;
  mobileView(i: any) {
    this.mobileId = i;
    this.dialog.open(this.mobileDialog)
  }

  @ViewChild('addressDialog') addressDialog = {} as TemplateRef<any>;
  addressId: any;
  addressView(i: any) {
    this.addressId = i;
    this.dialog.open(this.addressDialog)
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
    this.dialog.open(this.editInventoryDialog);
    // console.log(item);
  }

  editInventory() {
    // console.log(this.currentItem);
    // this.inventoryTable= this.inventoryTable.filter((item:any) => item.siteId !== this.currentItem.siteId);
    // this.getInventory();

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
      'state': this.currentItem.state,
      'city': this.currentItem.city,
      'remarks': this.currentItem.remarks
    }

    this.alertSer.wait();

    this.vendorSer.updatevendor(this.originalObject).subscribe((res: any) => {
      // console.log(res);

      if(res) {
        this.alertSer.success(res);
      }

      setTimeout(() => {
        window.location.reload();
      }, 3000)

    }, (err: any) => {
      if(err) {
        this.alertSer.error();
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
    this.dialog.open(this.deleteInventoryDialog);
    // console.log("Selected Item:: ", item);
  }

  deleteInventory() {
    // console.log(this.currentItem);

    this.alertSer.wait();

    // this.inventoryTable = this.inventoryTable.filter((item: any) => item.siteId !== this.currentItem.siteId);

    this.inventorySer.deleteInventory(this.currentItem).subscribe((res: any) => {
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
      this.dialog.open(this.viewInventoryDialog)
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
      this.dialog.open(this.editInventoryDialog)
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
