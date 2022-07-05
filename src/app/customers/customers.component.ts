import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    var x = <HTMLElement>document.getElementById(`plus-img${this.currentid}`);
    // console.log(`plus-img${this.currentid}`);
    if (!x.contains(e.target)) {
      if (x.style.display == 'flex' || x.style.display == 'block') {
        x.style.display = 'none';
      }
    }
  }

  showLoader=false;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.CustomerReport();
  }

  CustomerTable: any;
  CustomerReport() {
    this.http.get('assets/JSON/customerData.json').subscribe(res => {
      // console.log("CustomerReport::",res);
      this.CustomerTable = res;
    });
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

  showAddSite = false;
  showAddCamera = false;
  showAddCustomer = false;
  showAddUser = false;
  showAddBusinessVertical = false;
  // closenow(value:any) {
  //   this.showAddSite = value;
  // }

  closenow(value: any, type: String) {
    if (type == 'site') { this.showAddSite = value; }
    if (type == 'camr') { this.showAddCamera = value; }
    if (type == 'cust') { this.showAddCustomer = value; }
    if (type == 'vert') { this.showAddBusinessVertical = value; }
    if (type == 'user') { this.showAddUser = value; }
    // console.log("SITES:: ",type)

    setTimeout(() => {
      var openform = localStorage.getItem('opennewform');
      if (openform == 'showAddSite') { this.showAddSite = true; }
      if (openform == 'showAddCamera') { this.showAddCamera = true; }
      if (openform == 'showAddCustomer') { this.showAddCustomer = true; }
      if (openform == 'showAddBusinessVertical') { this.showAddBusinessVertical = true; }
      if (openform == 'showAddUser') { this.showAddUser = true; }
      localStorage.setItem('opennewform', '');
    }, 100)
  }

  // showAddCamera = false;

  // closenow1(value:any) {
  //   this.showAddCamera = value;
  // }

  // showAddCustomer = false;

  // closenow2(value:any) {
  //   this.showAddCustomer = value;
  // }

  // showAddUser = false;

  // closenow3(value:any) {
  //   this.showAddUser = value;
  // }

  // showAddBusinessVertical = false;

  // closenow4(value:any) {
  //   this.showAddBusinessVertical = value;
  // }

  icons1: boolean = true;
  iconsnew1() {
    this.icons1 = !this.icons1;
  }

  masterSelected: boolean = false;

  // allchecked(e:any){
  //   if(document.querySelector('#allchecked:checked')){
  //     this.masterSelected = true; 
  //   }else {
  //     this.masterSelected = false;
  //   }
  // }

  // Start Checkbox
  selectedAll: any;

  selectAll() {
    for (var i = 0; i < this.CustomerTable.length; i++) {
      // console.log(this.CustomerTable[i])
      this.CustomerTable[i].selected = this.selectedAll;
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.CustomerTable.every(function (item: any) {
      // console.log(item)
      return item.selected == true;
    })
  }
  // End Checkbox


  // deleteRow(id: any) {
  //   console.log("Out of delete():: ", id);
  //   for (let i = 0; i < this.CustomerTable.length; ++i) {
  //     console.log("InSide of delete():: ", i);
  //     if (this.CustomerTable[i].id === id) {
  //       console.log("InSide of  if delete():: ", this.CustomerTable[i]);
  //       this.CustomerTable.splice(i, 1);
  //       console.log("Final:: ", this.CustomerTable.splice(i, 1));
  //     }
  //   }
  // }



  // ---------------- Start delete ---------------------
  deleteRow: any;

  deleteRow1(item:any,i: any) {
    console.log("DELETEROW:: ",item);
    this.showLoader=true;
    setTimeout(()=>{
      this.showLoader=false;
      this.CustomerTable.splice(i, 1);
    },1000);
  }

  deletePopup: boolean = true;
  confirmDeleteRow() {
    console.log("ToBE DELETED:: ",this.currentItem);
    this.CustomerTable= this.CustomerTable.filter((item:any) => item.siteId !== this.currentItem.siteId);
    this.deletePopup = true;
  }

  closeDeletePopup() {
    this.deletePopup = true;
  }

  currentItem: any;
  openDeletePopup(item: any, i: any) {
    this.currentItem = item;
    // console.log("Selected Item:: ", item);
    this.deletePopup = false;
    // console.log("Open Delete Popup:: ",this.deletePopup);
    // console.log(this.CustomerTable.siteId);
  }

// ------- end delete ----------------
  
// -------start Edit -------------
  editPopup: boolean = true;

  confirmEditRow() {
    console.log("TO BE EDITED:: ",this.currentItem);
    // this.CustomerTable= this.CustomerTable.filter((item:any) => item.siteId !== this.currentItem.siteId);
    this.editPopup = true;
  }

  closeEditPopup() {
    this.editPopup = true;
  }

  openEditPopup(item: any, i: any) {
    this.currentItem = item;
    // console.log("Selected Item:: ", item);
    this.editPopup = false;
    // console.log("Open Delete Popup:: ",this.editPopup);
    // console.log(this.CustomerTable.siteId);
  }
// -------------- End Edit ------------------




  // ------------- start View --------------------

  viewPopup: boolean = true;

  confirmViewRow() {
    console.log("ToBE DELETED:: ",this.currentItem);
    this.viewPopup = true;
  }

  closeViewPopup() {
    this.viewPopup = true;
  }

  openViewPopup(item: any, i: any) {
    this.currentItem = item;
    console.log("VIEW PAGE:: ",this.currentItem);
    this.viewPopup = false;
  }

  // ------------- end View ---------------------
}
