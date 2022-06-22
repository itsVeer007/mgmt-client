import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-add-new-customer',
  templateUrl: './add-new-customer.component.html',
  styleUrls: ['./add-new-customer.component.css']
})
export class AddNewCustomerComponent implements OnInit {

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<boolean>();
  
  closeAddCustomer(value:boolean) {
    this.newItemEvent.emit(value);
  }

  constructor() { }

  ngOnInit(): void {
  }

  billing_address:boolean = true;
  showBillingAddress(event:any) {
    var x = (event.target.value)
    if(x == 'yes'){
      this.billing_address = true
    }else{
      this.billing_address = false
    }
  }
}
