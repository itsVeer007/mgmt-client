import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdvertisementsService } from 'src/services/advertisements.service';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {

  @Output() newItemEvent = new EventEmitter<boolean>()
  
  constructor(
    private assetService: AssetService,
    private siteSer: SiteService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public alertSer: AlertService,
    private storageSer: StorageService,
    private adver:AdvertisementsService
  ) { }

  searchText!: string;
  tableLoader: boolean = false;
  user: any;
  selectedName:any
  newAdId: string | null = null;
  interval: any;
  ngOnInit() {
    
    this.user = this.storageSer.get('user');
    this.listIssueInfo();
    this.category()
    this.interval = setInterval(() => {
      this.changeColor();
    }, 1000);
  }
  colors: string[] = ['#084982', '#D34135'];
  currentColorIndex: number = 0;
  changeColor(): void {
    // Cycle through the colors
    this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
  }



  siteData:any=[]
  showLoader:any
  newlistAdsInfoData:any = [];
  listAdsInfoData:any;

  Category:any = 'All';
  deviceId:any = "All";
  adName:any = 'All';
  devices:any;
  ticketStatusObj = {
    fromDate: null,
    toDate:null
  }



  filterData:any
  filter(type:any) {
    let Category:any;
    let subcategoryId:any;
    let deviceId:any;

    this.Category == 'All' ? Category =  null : Category = this.Category;
    this.subcategoryId == 'All'? subcategoryId = null : subcategoryId = this.subcategoryId;
    this.deviceId == 'All'? deviceId = null : deviceId = this.deviceId;
    

    if(type === "All") {
      this.newSiteData = this.siteData;
      
    
    } else {
      this.adver.listIssueInfo({Category: Category ,deviceId:deviceId, subcategoryId:subcategoryId}).subscribe((res:any)=> {
        this.newSiteData = res.IssueInfo;
        if(!deviceId) {
          this.newDeviceData = res.IssueInfo.flatMap((item: any) => item.deviceInfo);
        }
      })
    }
  }


  listDevices(site: any) {
    this.adver.listAdsInfo(site).subscribe((res: any) => {
      this.devices = res.sites.flatMap((item:any)=>item.devices);
    })
  }

  advertisements: any = [];
  newAdvertisements: any = [];
 

  deviceData:any = []
  newDeviceData:any = []
  approachData: any =[]
  commentData: any = []
  commentDataArray:any=[]
  approachDataArray:any=[]
  newSiteData: any = []

  listIssueInfo() {
    this.tableLoader = true;
    this.adver.listIssueInfo().subscribe((res:any)=> {
     
      this.getMetadata();
      this.tableLoader = false
      this.siteData = res.IssueInfo;
      this.newSiteData = this.siteData
      // this.deviceData = this.siteData.flatMap((item:any) => item.deviceInfo);
      // this.newDeviceData = this.deviceData;
      // this.commentData = this.newSiteData.map((item:any)=>{
      //   item.commentsCount});
      // this.approachData = this.newSiteData.map((item:any)=>{
      //   item.approachCount});
      //   console.log(this.commentData)

    })
  }



  subCategoryList:any=[]

 subcategoryId:any="All"

 devicelist:any=[]

  openSubcategoryList(item:any) {

    this.subCategoryList = item.subCategoryList
  
  }

  comment:any

  updateAdForComment() {
   
   
    let updateDataForComment = {
      issueId :this.currentcomment.issueId,
       createdBy:this.user?.UserId,
         commentInfo :this.comment
     }
  



    this.adver.addCommentForIssue(updateDataForComment).subscribe((res:any)=> {
      if(res?.statusCode == 200 ) {
        this.alertSer.success(res?.message)

        this.listIssueInfo()
        this.adver.listCommentsForIssueId(this.currentcomment).subscribe((res:any)=>{
          this.commentDataArray =res.data
          this.comment=null;
       })
      }
    },(error:any)=> {
      this.alertSer.error(error?.err?.message)
    })
  }

  currentItem1:any

  @ViewChild('openCommentDialog') openCommentDialog = {} as TemplateRef<any>;
  showAddComment(item:any) {

    this.currentcomment=item;
    this.dialog.open(this.openCommentDialog)
    this.comment=null;
  }
  showAddComment1(){
    this.dialog.open(this.openCommentDialog)
    this.comment=null;
  }
  
  Approach:any;
  @ViewChild('openApproachDialog') openApproachDialog = {} as TemplateRef<any>;

  showAddApproach(item:any) {
    this.currentApproach=item;
    this.dialog.open(this.openApproachDialog)
  }
  showAddApproach1() {
  
    this.dialog.open(this.openApproachDialog)
  }



  @ViewChild('usedItemsDialog') usedItemsDialog = {} as TemplateRef<any>;
  openView(item:any) {

    
    this.currentcomment=item;
    console.log(this.currentcomment)
    this.adver.listCommentsForIssueId(item).subscribe((res:any)=>{
       this.commentDataArray =res.data
    })
    this.dialog.open(this.usedItemsDialog)
  }

  currentApproach:any;
  @ViewChild('approachItemsDialog') approachItemsDialog = {} as TemplateRef<any>;
 
  openViewApproach(item:any) {
    this.currentApproach=item
    this.adver.listApproachesForIssueId(item).subscribe((res:any)=>{
      this.approachDataArray =res.data
   })

   
    this.dialog.open(this.approachItemsDialog)
  }


currentItem:any
currentcomment:any;
currentcomment1:any = []

@ViewChild('viewitemsDialog') viewitemsDialog = {} as TemplateRef<any>;

  openViewPopup(item:any) {
    console.log(item)
    this.currentcomment1 = item;
    this.dialog.open(this.viewitemsDialog); 
  }

  @ViewChild('editAssetDialog') editAssetDialog = {} as TemplateRef<any>;
  openEditPopupp(item:any) {
   
    this.subCategoryList = this.categoryList.filter((el:any)=>{
      return el.catId==item.categoryId
    })[0].subCategoryList
    
    this.currentItem = item
    this.dialog.open(this.editAssetDialog);
  }
  
  isStatusChanged: boolean = false;
  
  updateAd() {
    let updateData = {
      issueId :this.currentItem.issueId ,
      
      modifiedBy:this.user?.UserId,
      issueName:this.currentItem.issueName,
      issueCategoryId:this.currentItem.categoryId,
      issueSubCategoryId: this.currentItem.subCategoryId,
      issueStatus:this.currentItem.statusId,
      issueDescription: this.currentItem.issueDescription,
      // UpadateAttachment:this.selectedFile
    
    }
    this.adver.updateIssue(updateData).subscribe((res:any)=> {
     
      if(res?.statusCode == 200 ) {
        // this.filter(this.currentItem)
        this.alertSer.success(res?.message)
        this.listIssueInfo()
      }
    },(error:any)=> {
      this.alertSer.error(error?.err?.message)
    })
  }


  categoryList:any = [];
  category() {
    this.adver.category().subscribe((res:any) => {
      
      this.categoryList = res.categoryList
   
    })
  }

  @ViewChild('deleteAssetDialog') deleteAssetDialog = {} as TemplateRef<any>;
  deleteRow: any;
  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteAssetDialog);
  }

  confirmDeleteRow() {
    this.adver.delete(this.currentItem).subscribe((res:any)=> {
    
      if(res?.statusCode == 200 ) {
        this.filter(this.currentItem);
        this.alertSer.success(res?.message)
        this. listIssueInfo()
      }
    },(error:any)=> {
      this.alertSer.error(error?.err?.message)
    })
  }

  Remarks:any;
  updateAdForApproach(){
    let updateDataForComment = {
      issueId :this.currentApproach.issueId,
      createdBy:this.user?.UserId,
      approachName :this.Approach,
      remarks:this.Remarks
    }
    this.adver.addApproachForIssue(updateDataForComment).subscribe((res:any)=> {
      if(res?.statusCode == 200 ) {
        this.alertSer.success(res?.message)
        this.listIssueInfo()
        this.adver.listApproachesForIssueId(this.currentApproach).subscribe((res:any)=>{
          this.approachDataArray =res.data
       })
        this.Approach=null;
        this.Remarks=null;
      }
      else{
        this.alertSer.error(res?.message)

      }
    },(error:any)=> {
      this.alertSer.error(error?.err?.message)
    })

  }

  /* file upload */
  selectedFile: any;
  // selectedFiles: any = [];

  onFileSelected(event: any) {
    console.log(event.target.files)
    let x = event.target.files[0].type;
    
    
    if(typeof(event) == 'object') {
      this.selectedFile = event.target.files[0] ?? null;
    }
  }




  










  getLoaderFromChild(data: boolean) {
    this.tableLoader = data;
  }

  getAdsFromChild(data: any) {
    this.newlistAdsInfoData = data;
  }

  getSearchFromChild(data: any) {
    this.searchText = data;
  }

  deviceType: any;
  deviceMode: any;
  addStatus: any;
  workingDays: any;
  model_object_type:any
  getMetadata() {
    let data = this.storageSer.get('metaData');
    // console.log(data)
    data?.forEach((item: any) => {
      if(item.type == 2) {
        this.deviceType = item.metadata;
      } else if(item.type == 1) {
        this.deviceMode = item.metadata;
      } else if(item.type == 111) {
        this.addStatus = item.metadata;
      } else if(item.type == 6) {
        this.workingDays = item.metadata;
      }
      else if(item.type == 7) {
        this.model_object_type = item.metadata;
      }
    });
  }

  addRule:boolean = false;
  final:any
  showAsset: boolean = false;

  showAddAsset(type: any , value?:any) {
    console.log(value)
   this.final =  value 
    if (type == 'asset') {
      this.showAsset = true;
    }
    if (type == 'rule') {
      this.addRule = true;
    }
  }

  lastSubmittedItemId:any
  closenow(type: String) {
    if (type == 'asset') {
      this.showAsset = false;
    }
    if (type == 'rule') {
      this.addRule = false;
    }
  }

  /* Edit Asset Status */
  @ViewChild('editStatusDialog') editStatus = {} as TemplateRef<any>;
  openEditStatus(data: any) {
    this.currentItem = data;
    this.dialog.open(this.editStatus);
  }

  changeAssetStatus() {
    this.assetService.updateAssetStatus(this.currentItem).subscribe((res: any) => {
      this.alertSer.success(res.message);
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err.error.message);
      };
    });
  }


  /* add actions */
 

  originalObject: any;
  changedKeys: any[] = [];

  onDateChange(e: any) {
    let x = e.targetElement.name;
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onSelectChange(event: any) {
    let x = event.source.ngControl.name;
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onInputChange(event: any) {
    let x = event.target['name'];
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  confirmEditRow() {
    this.originalObject = {
      "id": this.currentItem.id,
      "deviceModeId": this.currentItem.deviceModeId,
      "playOrder": this.currentItem.playOrder,
      "modifiedBy": 1,
      "fromDate": this.currentItem.fromDate,
      "toDate": this.currentItem.toDate,
      "active": this.currentItem.active,
      "status": this.currentItem.status
    };

    this.originalObject.fromDate = this.datepipe.transform(this.currentItem.fromDate, 'yyyy-MM-dd');
    this.originalObject.toDate = this.datepipe.transform(this.currentItem.toDate, 'yyyy-MM-dd');
    this.assetService.modifyAssetForDevice({asset: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      // console.log(res);
      this.alertSer.success(res?.message);
    }, (err: any) => {
        this.alertSer.wait();
    })
  }



  deleteRow1(item: any, i: any) {
    // console.log(item);
    setTimeout(() => {
      this.newlistAdsInfoData.splice(i, 1);
    }, 1000);
  }

  @ViewChild('addPlayerDialog') addPlayerDialog: any = ElementRef;
  openPlayerDialog(data: any) {
    console.log(data)
    this.currentItem = data;
    this.dialog.open(this.addPlayerDialog);
  }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.newSiteData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  sorted1 = false;
  sort1(label: any) {
    this.sorted1 = !this.sorted1;
    var x = this.commentDataArray;
    if (this.sorted1 == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }


  sorted2 = false;
  sort2(label: any) {
    this.sorted2 = !this.sorted2;
    var x = this.approachDataArray;
    if (this.sorted2 == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}
