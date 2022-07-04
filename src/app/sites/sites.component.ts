import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css']
})
export class SitesComponent implements OnInit {

  @HostListener('document:mousedown', ['$event']) onGlobalClick1(e:any): void {
    var x = <HTMLElement>document.getElementById(`plus${this.currentid}`);
    // console.log("ClosedId:: ",`plus${this.currentid}`);
    if(!x.contains(e.target)){
      if(x.style.display == 'flex' || x.style.display == 'block') {
        x.style.display = 'none';
      }
    }


      // if(x.style.display == "none"){
      //   if(this.visibility){
      //     if (!this.popupmodal.nativeElement.contains(e.target)) {
      //       this.visibility=!this.visibility;
      //       this.calldisabled = true;
      //       this.time = null;
      //    }else{}
      //   }
      // }

  }
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.SiteTable();
  }

  tableData: any;
  
  SiteTable() {
    this.http.get('assets/JSON/siteData.json').subscribe(res=>{
      // console.log("Sites:: ",res);
      this.tableData = res;
    });
  }

  showAddSite = false;

  closenow(value:any) {
    this.showAddSite = value;
  }


  showAddCamera = false;

  closenow1(value:any) {
    this.showAddCamera = value;
  }

  showAddCustomer = false;

  closenow2(value:any) {
    this.showAddCustomer = value;
  }

  showAddUser = false;

  closenow3(value:any) {
    this.showAddUser = value;
  }

  showAddBusinessVertical = false;

  closenow4(value:any) {
    this.showAddBusinessVertical = value;
  }
  
  icons1:boolean = true;
  iconsnew1() {
    this.icons1=!this.icons1;
  }
  
  

  address: boolean = true;
  addressView() {
    this.address = !this.address;
  }

  currentid=0;
  closeDot(e: any, i: any) {
    this.currentid= i;
    var x = e.target.parentNode.nextElementSibling;
    console.log("Close-Click:: ",x);
    if(x.style.display =='none'){
      x.style.display ='flex';
    }else{
      x.style.display ='none';
    }
  }

  allchecked(e:any){

    if(document.querySelector('#allclicked:checked')){
      var checkboxes = <HTMLInputElement><unknown>document.getElementsByName('foo');
      for(var checkbox in checkboxes){
        // checkbox.checked = source.checked;
        // console.log(checkbox)
      }
        
    }
  }
}


