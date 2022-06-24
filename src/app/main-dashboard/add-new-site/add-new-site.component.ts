import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-add-new-site',
  templateUrl: './add-new-site.component.html',
  styleUrls: ['./add-new-site.component.css']
})
export class AddNewSiteComponent implements OnInit {

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<boolean>();
  
  closeAddSite(value:boolean) {
    this.newItemEvent.emit(value);
  }

  constructor() { }

  ngOnInit(): void {
    console.log(this.show)
  }

  checkbox(e:any, type:any){
    if(type== 'preinst'){
      console.log(e.target.checked, type)
    }
  }

}
