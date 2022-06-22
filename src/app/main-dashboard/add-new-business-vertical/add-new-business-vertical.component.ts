import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-add-new-business-vertical',
  templateUrl: './add-new-business-vertical.component.html',
  styleUrls: ['./add-new-business-vertical.component.css']
})
export class AddNewBusinessVerticalComponent implements OnInit {

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<boolean>();
  
  closeAddVertical(value:boolean) {
    this.newItemEvent.emit(value);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
