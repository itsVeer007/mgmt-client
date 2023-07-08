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
      // this.productMasterSer.mySub = res;
      // console.log(this.productMasterSer.mySub);

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
  statusVal: any;
  removeDuplicates() {
    this.brandNames = this.productMaster.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.productCategoryId == current.productCategoryId);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.categoryTypes = this.productMaster.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.productTypeId == current.productTypeId);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.statusVal = this.productMaster.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.productStatusId == current.productStatusId);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
  }

  productCategoryId: any = '';
  productTypeId: any = '';
  productStatusId: any = '';
  createdTime: any = '';
  createdTime1: any = '';

  applyFilter() {
    let myObj = {
      'productCategoryId': this.productCategoryId ? this.productCategoryId : 0,
      'productTypeId': this.productTypeId ? this.productTypeId : 0,
      'productStatusId': this.productStatusId ? this.productStatusId : 0,
      'createdTime': this.createdTime ? this.createdTime : '',
      'createdTime1': this.createdTime1 ? this.createdTime1 : ''
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
    onMetadataChange() {
      this.metaDataSer.getMetadata().subscribe((res: any) => {
        for(let item of res) {
          if(item.type == 'Product_Status') {
            this.productStatus = item.metadata;
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

  editInventory() {
    // console.log(this.currentItem);
    // this.productMaster= this.productMaster.filter((item:any) => item.siteId !== this.currentItem.siteId);
    // this.getInventory();

    this.originalObject = {
      "id": this.currentItem.id,
      "productCategoryId": this.currentItem.productCategoryId,
      "name": this.currentItem.name,
      "description": this.currentItem.description,
      "uomId": this.currentItem.uomId,
      "productModelId": this.currentItem.productModelId,
      "productTypeId": this.currentItem.productTypeId,
      "cost": this.currentItem.cost,
      "purchaseVendorId": this.currentItem.purchaseVendorId,
      "purchaseLink": this.currentItem.purchaseLink,
      "returnable": this.currentItem.returnable,
      "maintenanceRequired": this.currentItem.maintenanceRequired,
      "productStatusId": this.currentItem.productStatusId,
      "remarks": this.currentItem.remarks,
      "modifiedBy": 1,
    }

    this.alertSer.wait();
    this.productMasterSer.updateProductMaster(this.originalObject).subscribe((res: any) => {
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
