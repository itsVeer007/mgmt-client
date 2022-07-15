import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.css']
})
export class AddNewUserComponent implements OnInit {

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<boolean>();
  
  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    var x = <HTMLElement>document.getElementById(`user`);
    if (x != null) {
      if (!x.contains(e.target)) {
        this.closeAddUser(false);
      }
    }
  }
  
  closeAddUser(value:boolean) {
    this.newItemEvent.emit(value);
  }

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  openAnotherForm(newform:any) {
    // this.newItemEvent.emit(false);
    localStorage.setItem('opennewform', newform)
    this.closeAddUser(false);
  }

}
