import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MetadataService } from 'src/services/metadata.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-meta-data',
  templateUrl: './meta-data.component.html',
  styleUrls: ['./meta-data.component.css']
})
export class MetaDataComponent implements OnInit {

  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    var x = <HTMLElement>document.getElementById(`plus-img${this.currentid}`);
    var y = <HTMLElement>document.getElementById(`icons-site`);

    // console.log(`plus-img${this.currentid}`);
    if (x != null) {
      if (!x.contains(e.target)) {
        if (x.style.display == 'flex' || x.style.display == 'block') {
          x.style.display = 'none';
        }
      }
    }

    // if (y != null) {
    //   console.log(`icons-site`);
    //   if (!y.contains(e.target)) {
    //     this.icons1 = false;
    //   }
    // }
  }




  showLoader = false;
  constructor(private http: HttpClient, private metaDataSer: MetadataService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.CustomerReport();
  }

  showIconVertical: boolean = false;
  showIconCustomer: boolean = false;
  showIconSite: boolean = false;
  showIconCamera: boolean = false;
  showIconAnalytic: boolean = false;
  showIconUser: boolean = false;

  showIconView: boolean = false;
  showIconEdit: boolean = false;
  showIconDelete: boolean = false;
  showIconView1: boolean = false;
  showIconEdit1: boolean = false;
  showIconDelete1: boolean = false;

  searchText: any;
  metaData: any = []
  newMetaData: any = [];
  typeToTable: any
  CustomerReport() {
    this.metaDataSer.getMetadata().subscribe((res: any) => {
      // console.log(res);

      const x = res.flatMap((item: any) => item.metadata);
      this.metaData = x;

      const y = res.flatMap((item: any) => item.type);
      this.typeToTable = y;
    })
  }

  deviceSearch: any;
  searchDevices(e: any) {
    this.deviceSearch = (e.target as HTMLInputElement).value;
  }

  filterDevices(data: any) {
    this.metaDataSer.getMetadataByType(data).subscribe((res: any) => {
      // console.log(res);

      const data = res.flatMap((item: any) => item.metadata);
      this.newMetaData = data;
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

  closenow(value: any, type: String) {
    if (type == 'ticket') { this.showTicket = value; }
  }

  showTicket: boolean = false;

  show(type: string, val: any) {
    if (type == 'ticket') { this.showTicket = true }
    localStorage.setItem('metaType', val)
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
    for (var i = 0; i < this.newMetaData.length; i++) {
      // console.log(this.metaData[i])
      this.newMetaData[i].selected = this.selectedAll;
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.newMetaData.every(function (item: any) {
      // console.log(item)
      return item.selected == true;
    })
  }

  currentItem: any;

  @ViewChild('viewDataDialog') viewDataDialog = {} as TemplateRef<any>;

  openViewPopup(item: any, i: any) {
    this.currentItem = item;
    this.dialog.open(this.viewDataDialog);
    // console.log(this.currentItem);
  }

  @ViewChild('editDataDialog') editDataDialog = {} as TemplateRef<any>;

  typeFromLocal: any;
  openEditPopup(item: any, val: any) {
    localStorage.setItem('metaType', val);
    this.typeFromLocal = localStorage.getItem('metaType');
    // console.log(this.typeFromLocal);

    this.currentItem = JSON.parse(JSON.stringify(item));
    this.dialog.open(this.editDataDialog);
    // console.log(this.currentItem);
  }

  updateData0: any;
  updateData1: any;
  updateData2: any
  confirmEditRow() {
    let myObj = {
      "keyId": this.currentItem.keyId,
      "type": this.typeFromLocal,
      "value": this.currentItem.value,
      "modifiedBy": 1,
      "remarks": this.currentItem.remarks
    }

    // this.updateData2 = Swal.fire({
    //   text: "Please wait",
    //   imageUrl: "assets/gif/ajax-loading-gif.gif",
    //   showConfirmButton: false,
    //   allowOutsideClick: false
    // });

    this.metaDataSer.updateMetadataKeyValue(myObj).subscribe((res: any) => {
      // console.log(res);

      if(res) {
        this.updateData1 = Swal.fire({
          icon: 'success',
          title: 'Done!',
          text: `${res.message}`,
        });
      }
    }, (err: any) => {
      if(err) {
        this.updateData0 = Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Updating Data failed',
          // timer: 3000,
        });
      };
    })
  }


  @ViewChild('deleteDataDialog') deleteDataDialog = {} as TemplateRef<any>;

  openDeletePopup(item: any, i: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteDataDialog);
  }


  deleteRow1(item: any, i: any) {
    // console.log(item);
    this.showLoader = true;
    setTimeout(() => {
      this.showLoader = false;
      this.newMetaData.splice(i, 1);
    }, 1000);
  }

  confirmDeleteRow() {
    // console.log(this.currentItem);
    this.newMetaData = this.newMetaData.filter((item: any) => item.siteId !== this.currentItem.siteId);
  }


  /* checkbox control */

  viewArray: any = [];
  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      this.dialog.open(this.viewDataDialog);
    }
  }

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
      this.dialog.open(this.editDataDialog);
    }
    this.CustomerReport();
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
        // this.confirmDeleteRow();
        this.newMetaData = this.newMetaData.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.newMetaData.forEach((el: any) => {
        this.newMetaData = this.newMetaData.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }


  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.newMetaData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}
