import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-add-new-site',
  templateUrl: './add-new-site.component.html',
  styleUrls: ['./add-new-site.component.css']
})
export class AddNewSiteComponent implements OnInit {

  @Input() show: any;

  @Output() newItemEvent = new EventEmitter<boolean>();

  closeAddSite(value: boolean) {
    this.newItemEvent.emit(value);
  }

  constructor() { }

  ngOnInit(): void {
    console.log(this.show)
  }

  isShown: boolean = false; // hidden by default

  toggleShowOnOff() {
    this.isShown = !this.isShown;
  }

  Monitoring: boolean = false;

  toggleShowMonit() {
    this.Monitoring = !this.Monitoring;
  }

  Business: boolean = false;

  toggleShowBusiness() {
    this.Business = !this.Business;
  }

  existSecuity: boolean = false;

  toggleShowExistSecuity(value: any, type: any) {
    if (type == 'security') {
      if (value == 'on') {
        this.existSecuity = true;
      }
      else {
        this.existSecuity = false;
      }
    }
  }

  internet: boolean = false;

  toggleShowInternet(value: any, type: any) {
    if (type == 'internet') {
      if (value == 'on') {
        this.internet = true;
      }
      else {
        this.internet = false;
      }
    }
  }

  moni: boolean = false;

  monitoring() {
    this.moni = !this.moni;
  }
 
  intell: boolean = false;
  
  businessIntell() {
    this.intell = !this.intell;
  }

  // checkbox(e:any, type:any){
  // if(type== 'preinst'){
  //   console.log(e.target.checked, type)
  // }
  //   if (document.querySelector('#bopis:checked')) {
  //     console.log(e.target.checked, type);
  //   }
  // }

}
