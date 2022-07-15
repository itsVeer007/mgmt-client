import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-camera',
  templateUrl: './add-new-camera.component.html',
  styleUrls: ['./add-new-camera.component.css']
})
export class AddNewCameraComponent implements OnInit {

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<boolean>();
  
  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    var x = <HTMLElement>document.getElementById(`camera`);
    if (x != null) {
      if (!x.contains(e.target)) {
        this.closeAddCamera(false);
      }
    }
  }
  
  closeAddCamera(value:boolean) {
    this.newItemEvent.emit(value);
  }

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  openAnotherForm(newform:any) {
    // this.newItemEvent.emit(false);
    localStorage.setItem('opennewform', newform)
    this.closeAddCamera(false);
  }

}
