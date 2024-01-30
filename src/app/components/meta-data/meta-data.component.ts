import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { MetadataService } from 'src/services/metadata.service';

@Component({
  selector: 'app-meta-data',
  templateUrl: './meta-data.component.html',
  styleUrls: ['./meta-data.component.css']
})
export class MetaDataComponent implements OnInit {

  constructor(
    private metaDataSer: MetadataService,
    public dialog: MatDialog,
    public alertSer: AlertService
  ) { }

  ngOnInit(): void {
    this.CustomerReport();
  }

  showLoader = false;
  searchText: any;
  metaData: any = []
  newMetaData: any = [];
  typeToTable: any = []
  CustomerReport() {
    this.showLoader = true;
    this.metaDataSer.getMetadata().subscribe((res: any) => {
      this.showLoader = false;
      this.metaData = res;
      this.newMetaData = this.metaData;
      let type = res.flatMap((item: any) => item.type);
      let typeName = res.flatMap((item: any) => item.typeName);

      this.typeToTable = type.map((key: any, index:any) => ({
        type: type[index],
        typeName: typeName[index]
      }));
    })
  }

  deviceSearch: any;
  searchDevices(e: any) {
    this.deviceSearch = (e.target as HTMLInputElement).value;
  }

  metaType: any = 'All';
  filterDevices(data: any) {
    if(data != 'All') {
      this.showLoader = true;
      this.metaDataSer.getMetadataByType(data).subscribe((res: any) => {
        this.showLoader = false;
        this.newMetaData = res;
      })
    } else {
      this.newMetaData = this.metaData;
    }
  }

  showTicket: boolean = false;
  show(type: string, val: any) {
    // if(val != 'All') {
      if (type == 'ticket') {
        this.showTicket = true
      }
      localStorage.setItem('metaType', val);
    // } else {
    //   this.alertSer.error('Please select type');
    // }
  }

  closenow(type: String) {
    if (type == 'ticket') {
      this.showTicket = false;
    }
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
  openEditPopup(item: any, type: any) {
    localStorage.setItem('metaType', type);
    this.typeFromLocal = localStorage.getItem('metaType');

    this.currentItem = JSON.parse(JSON.stringify(item));
    this.dialog.open(this.editDataDialog);
    // console.log(item);
  }

  confirmEditRow() {
    let myObj = {
      "keyId": this.currentItem.keyId,
      "type": this.typeFromLocal,
      "value": this.currentItem.value,
      "modifiedBy": 1,
      "remarks": this.currentItem.remarks
    }
    this.metaDataSer.updateMetadataKeyValue(myObj).subscribe((res: any) => {
      // console.log(res);
        this.alertSer.snackSuccess(res?.message);
        this.CustomerReport();
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err?.error?.message);
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


  /* checkbox control */
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

  viewArray: any = [];
  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      this.dialog.open(this.viewDataDialog);
    }
  }

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

}
