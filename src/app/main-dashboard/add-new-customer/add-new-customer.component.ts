import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms'

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

  productForm: FormGroup;

  constructor(private fb:FormBuilder) {
   
    this.productForm = this.fb.group({
      name: '',
      quantities: this.fb.array([]) ,
    });
  }

  ngOnInit(): void {
  }

  quantities() : FormArray {  
    return this.productForm.get("quantities") as FormArray  
  }  
     
  newQuantity(): FormGroup {  
    return this.fb.group({  
      addressType: '',  
      country: '',
      state: '',
      district: '',
      pincode: '',
      area: '',
    })  
  } 

  addQuantity() {  
    this.quantities().push(this.newQuantity());  
  } 

  onSubmit() {
    console.log(this.productForm.value);
  }
  
  address2: boolean = false;
  closeimg() {
    this.address2 = !this.address2;
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
