import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router';

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

  constructor(private fb:FormBuilder, private router:Router) {
   
    this.productForm = this.fb.group({
      name: '',
      quantities: this.fb.array([]) ,
    });
  }

  ngOnInit(): void {
    this.addQuantity()
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
  closeimg(e:any) {
    var x = e.target.parentNode.parentNode.parentNode;
    console.log(x.children);
    x.style.display = 'none'
    // this.address2 = !this.address2;
  }

  openAnotherForm(newform:any) {
    // this.newItemEvent.emit(false);
    localStorage.setItem('opennewform', newform)
    this.closeAddCustomer(false);
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
