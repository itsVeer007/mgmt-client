import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { MetadataService } from 'src/services/metadata.service';
import { ProductMasterService } from 'src/services/product-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-master',
  templateUrl: './product-master.component.html',
  styleUrls: ['./product-master.component.css']
})
export class ProductMasterComponent implements OnInit {

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
    private productMasterSer: ProductMasterService,
    private metaDataSer: MetadataService,

    public dialog: MatDialog,
    public alertSer: AlertService
    ) { }

  ngOnInit(): void {
    this.getInventory();
    this.onMetadataChange();
  }

  showIconView: boolean = false;
  showIconEdit: boolean = false;
  showIconDelete: boolean = false;
  showIconView1: boolean = false;
  showIconEdit1: boolean = false;
  showIconDelete1: boolean = false;

  searchText: any;
  searchTx: any;
  productMaster: any = [];
  newProductMaster: any = [];

  active: any = [];
  inActive: any = [];
  getInventory() {
    this.showLoader = true;
    this.productMasterSer.list().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      this.productMaster = res;
      this.newProductMaster = this.productMaster;

      for(let item of this.productMaster) {
        if(item.productStatusId == 1) {
          this.active.push(item);
        } else if(item.productStatusId == 2) {
          this.inActive.push(item);
        }
      }
    });
  }

  // filterBrand(val: any) {
  //   if(val == 'none') {
  //     this.newProductMaster = this.productMaster;
  //   } else {
  //     this.newProductMaster = this.productMaster.filter((el: any) => el.productBrand == val);
  //   }
  // }

  // filterCategory(val: any) {
  //   if(val == 'none') {
  //     this.newProductMaster = this.productMaster;
  //   } else {
  //     this.newProductMaster = this.productMaster.filter((el: any) => el.productCategory == val);
  //   }
  // }

  // filterStatus(val: any) {
  //   if(val == 'none') {
  //     this.newProductMaster = this.productMaster;
  //   } else {
  //     this.newProductMaster = this.productMaster.filter((el: any) => el.status == val);
  //   }
  // }


  brandNames: any;
  categoryTypes: any;
  // statusVal: any;
  removeDuplicates() {
    this.brandNames = this.productMaster.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.categoryId == current.categoryId);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.categoryTypes = this.productMaster.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.typeId == current.typeId);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    // this.statusVal = this.productMaster.reduce((acc: any, current: any) => {
    //   const x = acc.find((item: any) => item.statusId == current.statusId);
    //   if (!x) {
    //     return acc.concat([current]);
    //   } else {
    //     return acc;
    //   }
    // }, []);
  }

  categoryId: any = '';
  typeId: any = '';
  statusId: any = '';
  startDate: any = '';
  endDate: any = '';
  vendorId: any = '';

  applyFilter() {
    let myObj = {
      'categoryId': this.categoryId ? this.categoryId : -1,
      'typeId': this.typeId ? this.typeId : -1,
      'statusId': this.statusId ? this.statusId : -1,
      'startDate': this.startDate ? this.startDate : '',
      'endDate': this.endDate ? this.endDate : '',
      'vendorId': this.vendorId ? this.vendorId : ''
    }

    this.productMasterSer.filteBody(myObj).subscribe((res: any) => {
      // console.log(res);
      this.newProductMaster = res;
    })
  }

  // metaDataType: any
  // onMetadataChange(type: any) {
  //   this.metaDataSer.getMetadataByType(type).subscribe((res: any) => {
  //     console.log(res);
  //     this.metaDataType = res.flatMap((item: any) => item.metadata)

  //   })
  // }

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

    /* metadata methods */

    productStatus: any;
    uom: any;
    onMetadataChange() {
      this.metaDataSer.getMetadata().subscribe((res: any) => {
        for(let item of res) {
          if(item.type == 'Product_Status') {
            this.productStatus = item.metadata;
          } else if(item.type == 'uom') {
            this.uom = item.metadata;
          }
        }
      })
    }

  selectedAll: any;

  selectAll() {
    for (var i = 0; i < this.productMaster.length; i++) {
      this.productMaster[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.productMaster.every(function (item: any) {
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
    this.dialog.open(this.viewInventoryDialog, {maxWidth: '550px', maxHeight: '550px'});
    // console.log(this.currentItem);
  }

  /* update inventory */

  @ViewChild('editInventoryDialog') editInventoryDialog = {} as TemplateRef<any>;

  openEditPopup(item: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.dialog.open(this.editInventoryDialog, {maxWidth: '550px', maxHeight: '550px'});
    // console.log(item);
  }

  onSelectChange(event: any) {
    this.originalObject = {
      "id": this.currentItem.id,
      "categoryId": null,
      "typeId": null,
      "vendorId": null,
      "modifiedBy": 1,

      "name": this.currentItem.name,
      "quantity": this.currentItem.quantity,
      "description": this.currentItem.description,
      "uomId": this.currentItem.uomId,
      "model": this.currentItem.model,
      "cost": this.currentItem.cost,
      "purchaseLink": this.currentItem.purchaseLink,
      "returnable": this.currentItem.returnable,
      "maintenanceRequired": this.currentItem.maintenanceRequired,
      "statusId": this.currentItem.statusId,
      "remarks": this.currentItem.remarks
    };

    let x = event.source.ngControl.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onInputChange(event: any) {
    this.originalObject = {
      "id": this.currentItem.id,
      "categoryId": null,
      "typeId": null,
      "vendorId": null,
      "modifiedBy": 1,

      "name": this.currentItem.name,
      "quantity": this.currentItem.quantity,
      "description": this.currentItem.description,
      "uomId": this.currentItem.uomId,
      "model": this.currentItem.model,
      "cost": this.currentItem.cost,
      "purchaseLink": this.currentItem.purchaseLink,
      "returnable": this.currentItem.returnable,
      "maintenanceRequired": this.currentItem.maintenanceRequired,
      "statusId": this.currentItem.statusId,
      "remarks": this.currentItem.remarks
    };

    let x = event.target['name'];

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onRadioChange(event: any) {
    this.originalObject = {
      "id": this.currentItem.id,
      "categoryId": null,
      "typeId": null,
      "vendorId": null,
      "modifiedBy": 1,

      "name": this.currentItem.name,
      "quantity": this.currentItem.quantity,
      "description": this.currentItem.description,
      "uomId": this.currentItem.uomId,
      "model": this.currentItem.model,
      "cost": this.currentItem.cost,
      "purchaseLink": this.currentItem.purchaseLink,
      "returnable": this.currentItem.returnable,
      "maintenanceRequired": this.currentItem.maintenanceRequired,
      "statusId": this.currentItem.statusId,
      "remarks": this.currentItem.remarks
    };

    let x = event.source.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  editInventory() {
    this.originalObject = {
      "id": this.currentItem.id,
      "categoryId": null,
      "typeId": null,
      "vendorId": null,
      "modifiedBy": 1,

      "name": this.currentItem.name,
      "quantity": this.currentItem.quantity,
      "description": this.currentItem.description,
      "uomId": this.currentItem.uomId,
      "model": this.currentItem.model,
      "cost": this.currentItem.cost,
      "purchaseLink": this.currentItem.purchaseLink,
      "returnable": this.currentItem.returnable,
      "maintenanceRequired": this.currentItem.maintenanceRequired,
      "statusId": this.currentItem.statusId,
      "remarks": this.currentItem.remarks
    }

    this.alertSer.wait();
    this.productMasterSer.updateProductMaster({productMaster: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
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

  @ViewChild('deleteInventoryDialog') deleteInventoryDialog = {} as TemplateRef<any>;

  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteInventoryDialog, {maxWidth: '250px', maxHeight: '250px'});
  }

  deleteInventory() {
    this.alertSer.wait();

    this.productMasterSer.deleteProduct(this.currentItem).subscribe((res: any) => {
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
      this.dialog.open(this.viewInventoryDialog, {maxWidth: '550px', maxHeight: '550px'})
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
      this.dialog.open(this.editInventoryDialog, {maxWidth: '550px', maxHeight: '550px'})
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
        this.productMaster = this.productMaster.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.productMaster.forEach((el: any) => {
        this.productMaster = this.productMaster.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }


  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.productMaster;
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
