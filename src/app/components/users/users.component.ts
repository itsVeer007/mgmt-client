import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { StorageService } from 'src/services/storage.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(
    private userSer: UserService,
    private alertSer: AlertService,
    private dialog: MatDialog,
    private storageSer: StorageService
  ) { }
  
  showLoader = false;
  userData: any;
  ngOnInit(): void {
    this.userData = this.storageSer.get('user');
    this.listUsers();
  }

  searchText: any;
  userTableData: any = [];
  listUsers() {
    this.showLoader = true;
    this.userSer.listUsers().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      this.userTableData = res;
    })
  }

  userInfo: any;
  getUserInfoForUserId(data: any) {
    this.userSer.getUserInfoForUserId({userId: data?.user_id}).subscribe((res: any) => {
      this.userInfo = res;
    })
  }
  
  currentUser: any;
  @ViewChild('viewprofileDialog') viewprofileDialog = {} as TemplateRef<any>;
  openViewProfileDialog(data: any) {
    this.userSer.getUserInfoForUserId({userId: data?.user_id}).subscribe((res: any) => {
      this.currentUser = res;
    });
    this.dialog.open(this.viewprofileDialog);
  }

  @ViewChild('editprofileDialog') editprofileDialog = {} as TemplateRef<any>;
  openEditProfileDialog(data: any) {
    this.userSer.getUserInfoForUserId({userId: data?.user_id}).subscribe((res: any) => {
      this.currentUser = res;
    });
    this.dialog.open(this.editprofileDialog);
  }

  updateUser() {
    this.currentUser.modifiedBy = this.userData?.UserId;
    this.userSer.updateUser(this.currentUser).subscribe((res: any) => {
      // console.log(res);
      if(res.statusCode == 200) {
        this.listUsers();
        this.alertSer.success(res.message);
      } else {
        this.alertSer.error(res.message);
      }
    }, (err) => {
      this.alertSer.error(err.error.statusText)
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

  closenow(type: String) {
    if (type == 'user') { this.showAddUser = false; }
    if(type == 'additionalSite') {this.showAddSite = false;}
  }

  showAddUser: boolean = false;
  showAddSite: boolean = false;
  show(type: string) {
    if (type == 'user') { this.showAddUser = true; }
    if (type == 'additionalSite') { this.showAddSite = true; }
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
    for(var i = 0; i < this.userTableData.length; i++) {
      // console.log(this.userTableData[i].selected);
      this.userTableData[i].selected = !this.userTableData[i].selected;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.userTableData.every((item: any) => {
      // console.log(item);
      return item.selected == true;
    })
  }


  deleteRow: any;
  deleteRow1(item: any, i: any) {
    // console.log(item);
    this.showLoader = true;
    setTimeout(() => {
      this.showLoader = false;
      this.userTableData.splice(i, 1);
    }, 1000);
  }

  deletePopup: boolean = true;
  confirmDeleteRow() {
    // console.log(this.currentItem);
    this.userTableData = this.userTableData.filter((item: any) => item.siteId !== this.currentItem.siteId);
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
  }


  editPopup: boolean = true;
  confirmEditRow() {
    // console.log(/this.currentItem);
    // this.userTableData= this.userTableData.filter((item:any) => item.siteId !== this.currentItem.siteId);
    this.editPopup = true;
    this.listUsers();
  }

  closeEditPopup() {
    this.editPopup = true;
  }

  openEditPopup(item: any, i: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.editPopup = false;
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
      this.editPopup = false;
    }
    this.listUsers();
  }


  viewPopup: boolean = true;
  confirmViewRow() {
    this.viewPopup = true;
  }

  closeViewPopup() {
    this.viewPopup = true;
  }

  openViewPopup(item: any, i: any) {
    this.currentItem = item;
    this.viewPopup = false;
  }

  viewArray: any = [];
  ViewByCheckbox(itemV: any, i: any, e: any) {
    var checked = (e.target.checked);
    if (checked && !this.viewArray.includes(itemV)) {
      this.viewArray.push(itemV);
      console.log(this.viewArray);
      this.currentItem = this.viewArray[(this.viewArray.length - 1)];
    }
    if (!checked && this.viewArray.includes(itemV)) {
      this.viewArray.splice(this.viewArray.indexOf(itemV), 1);
    }
  }

  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      this.viewPopup = false;
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
        // this.confirmDeleteRow();
        this.userTableData = this.userTableData.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.userTableData.forEach((el: any) => {
        this.userTableData = this.userTableData.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.userTableData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }
}
