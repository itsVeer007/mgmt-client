import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-add-additional-site',
  templateUrl: './add-additional-site.component.html',
  styleUrls: ['./add-additional-site.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)", }), //apply default styles before animation starts
        animate(
          "750ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
        animate(
          "600ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddAdditionalSiteComponent implements OnInit {

  // @Input() show:any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`additionalSite`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       this.closeAddAdditionalSite(false);
  //     }
  //   }
  // }



  addSiteForm: any =  FormGroup;


  checked = false;


  site = {
    verticals: "",
    customers: "",
    selectSite: "",
  }

  searchText: any;

  items = ['john', 'mark', 'cooper', 'henry', 'roben'];
  siteIdList = [ '3001', '3002', '3003', '3004'];

  constructor(private fb: FormBuilder, private apiser: ApiService) { }

  ngOnInit(): void {
    this.addSiteForm = this.fb.group({
      'userId': new FormControl(''),
      'userName': new FormControl(''),
      'verticals': new FormControl(''),
      'customers': new FormControl(''),
      'selectSite': new FormControl(''),
      'checked': new FormControl()
    });

    // this.getSiteDetails()
  }

  // getSiteDetails(){
  //   this.apiser.getUser().subscribe((res:any)=>{
  //     // console.log(res)
  //     if(res.Status == 'Success'){
  //       this.site.userId= "";
  //       this.site.userName= "";
  //       this.site.verticals= res.verticals ;
  //       this.site.customers= res.customers ;
  //       this.site.selectSite= res.selectSite;

  //     }
  //   })
  // }

  onSubmit(): void {
  }

  closeAddAdditionalSite() {
    this.newItemEvent.emit(false);
  }

  submit(){
    console.log("Entered in AddUser:: ", this.addSiteForm.value);
  }

}