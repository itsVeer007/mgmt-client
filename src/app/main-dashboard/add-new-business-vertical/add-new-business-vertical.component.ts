import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-business-vertical',
  templateUrl: './add-new-business-vertical.component.html',
  styleUrls: ['./add-new-business-vertical.component.css']
})
export class AddNewBusinessVerticalComponent implements OnInit {

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<any>();
  
  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    var x = <HTMLElement>document.getElementById(`vertical`);
    if (x != null) {
      if (!x.contains(e.target)) {
        this.closeAddVertical(false);
      }
    }
  }
  
  closeAddVertical(value:any) {
    this.newItemEvent.emit(value);
  }

  constructor(
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  openAnotherForm(newform:any) {
    // this.newItemEvent.emit(false);
    localStorage.setItem('opennewform', newform)
    this.closeAddVertical(false);
  }

}
