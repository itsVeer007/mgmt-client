import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateFormComponent } from 'src/app/utilities/create-form/create-form.component';
import { AlertService } from 'src/services/alert.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    this.rowIndex = -1
  }

  constructor(
    private userSer: UserService,
    private alertSer: AlertService,
    private dialog: MatDialog,
    private storageSer: StorageService,
    private siteSer: SiteService,
    private http: HttpClient
  ) { }
  
  showLoader = false;
  userData: any;
  siteData: any
  ngOnInit(): void {
    this.userData = this.storageSer.get('user');
    this.siteData = this.storageSer.get('siteIds');
    this.listUsers();
  }

  searchText: any;
  assignText: any;
  userTableData: any = [];
  listUsers() {
    this.showLoader = true;
    this.userSer.listUsers().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      this.userTableData = res.sort((a: any, b: any) => a.user_id < b.user_id ? 1 : a.user_id > b.user_id ? -1 : 0);
    })
  }

  userInfo: any;
  getUserInfoForUserId(data: any) {
    this.rowIndex = this.userTableData.indexOf(data);
    this.userSer.getUserInfoForUserId({userId: data?.user_id}).subscribe((res: any) => {
      if(res.Status == 'Failed') {
        this.userInfo = null;
      } else {
        this.userInfo = res;
      }
    })
  }
  
  currentUser: any;
  openViewProfileDialog(data: any) {
    this.userSer.getUserInfoForUserId({userId: data?.user_id}).subscribe((res: any) => {
      this.currentUser = res;
      this.dialog.open(CreateFormComponent, {
        data: res
      });
    });
  }

  @ViewChild('editprofileDialog') editprofileDialog = {} as TemplateRef<any>;
  openEditProfileDialog(data: any) {
    this.userSer.getUserInfoForUserId({userId: data?.user_id}).subscribe((res: any) => {
      this.currentUser = res;
      this.getCountry();
    });
    this.dialog.open(this.editprofileDialog);
  }

  updateUser() {
    this.currentUser.modifiedBy = this.userData?.UserId;
    delete this.currentUser.roleList
    // delete this.currentUser.userId
    delete this.currentUser.verificationId
    delete this.currentUser.modifiedTime
    delete this.currentUser.email
    delete this.currentUser.createdTime
    delete this.currentUser.createdBy


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

  // @ViewChild('assignSiteDialog') assignSiteDialog = ElementRef;
  // assignSite(user:any){
  //   this.getSitesListForUserName();
  //   this.currentUser = user
  //   this.dialog.open(this.assignSiteDialog)
  // }

  userSites: any;
  getSitesListForAssign(user:any) {
    this.userSites = null;
    this.siteSer.getSitesListForAssign(user).subscribe({
      next: (res:any)=>{
        this.userSites = res;
        this.isAssigned();
        this.filterAssigned(1)
      },
      error:(err:any) => {
        this.alertSer.error(err.error.message);
      }
    });
  }

  isAssigned() {
    return this.newSitesList.filter((item: any) => this.userSites?.sites?.some((el: any) =>  {
      if(item.siteId == el.siteId) {
        item.isAssigned = true;
      }
    }));
  }

  filterAssigned(val: any) {
    let data: any = this.sitesList;
    if(val === 0) {
      this.newSitesList = data
    } else if(val === 1) {
      this.newSitesList = data.filter((item: any) => item.isAssigned);
    } else if(val === 2) {
      this.newSitesList = data.filter((item: any) => !item.isAssigned);
    }
  }

  sitesList: any = [];
  newSitesList: any = [];
  showLoading: boolean = false;
  assignedBtn!: number;
  rowIndex!: number;
  getSitesListForUserName(user:any) {
    this.newSitesList = [];
    this.assignedBtn = 1;
    this.assignText = null;

    this.rowIndex = this.userTableData.indexOf(user);
    this.currentItem = user;
    this.currentUser = user;
    this.showLoading = true;
    this.siteSer.getSitesListForUserName().subscribe((res: any) => {
      this.showLoading = false;
      if(res.Status == 'Success') {
        this.sitesList = res.sites.sort((a: any, b: any) => a.siteId < b.siteId ? -1 : a.siteId > b.siteId ? 1 : 0);
        this.sitesList.forEach((item: any) => item.isAssigned = false);
        this.newSitesList = this.sitesList;
        this.getSitesListForAssign(user);
        // this.isAssigned()

      }
    });
  }

  // selectedSites: any;
  submitAssignSite(site: any) {
    if(site.isAssigned) {
      this.userSer.unassignSiteForUser({userId: this.currentUser?.user_id, siteId: site?.siteId}).subscribe({
        next: (res:any) => {
          if (res.statusCode === 200) {
            this.getSitesListForUserName(this.currentItem);
            this.alertSer.snackSuccess(res.message);  
          } else {
            this.alertSer.error(res.message);
          }
        },
        error:(err:any) => {
          this.alertSer.error(err.error.message)
        }
      })
    } else {
      this.userSer.applySitesMapping({userId: this.currentUser?.user_id, siteList: [site?.siteId]}).subscribe({
        next: (res:any) => {
          if (res.status === 'Success') {
            this.getSitesListForUserName(this.currentItem);
            this.alertSer.snackSuccess(res.message);  
          } else {
            this.alertSer.error(res.message);
          }
        },
        error:(err:any) => {
          this.alertSer.error(err.error.message);
        }
      })
    }
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
      this.userTableData[i].selected = !this.userTableData[i].selected;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.userTableData.every((item: any) => {
      return item.selected == true;
    })
  }


  deleteRow: any;
  deleteRow1(item: any, i: any) {
    this.showLoader = true;
    setTimeout(() => {
      this.showLoader = false;
      this.userTableData.splice(i, 1);
    }, 1000);
  }

  deletePopup: boolean = true;
  confirmDeleteRow(data: any) {
    // this.userTableData = this.userTableData.filter((item: any) => item.siteId !== this.currentItem.siteId);
    // this.deletePopup = true;
    this.alertSer.confirmDialog().then((result) => {
      if(result.isConfirmed) {
        this.userSer.deleteUser(data).subscribe({
          next: (res: any) => {
            if(res.statusCode === 200) {
              this.listUsers();
              this.alertSer.success(res.message);
            } else {
              this.alertSer.error(res.message);
            }
          },
          error: (err: HttpErrorResponse) => {
            this.alertSer.error('Failed');
          }
        })
      }
    });
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
    // console.log(this.currentItem);
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

  countryList: any;
  getCountry() {
    this.http.get("assets/JSON/countryList.json").subscribe((res: any) => {
      this.countryList = res;
      this.filterState(this.currentUser?.country)
    });
  }

  stateList: any = [];
  filterState(val: any) {
    let x = this.countryList.filter((el: any) => el.countryName == val);
    this.stateList = x.flatMap((el: any) => el.states);
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
