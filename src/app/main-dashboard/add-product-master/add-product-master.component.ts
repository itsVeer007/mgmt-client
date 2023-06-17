import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { ProductMasterService } from 'src/services/product-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product-master',
  templateUrl: './add-product-master.component.html',
  styleUrls: ['./add-product-master.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }), //apply default styles before animation starts
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
export class AddProductMasterComponent implements OnInit {

  constructor(private router: Router, private productMasterSer: ProductMasterService, private apiser: ApiService, private fb: FormBuilder) { }

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<boolean>();

  @Output() newUser = new EventEmitter<any>();

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`user`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       this.closeAddUser(false);
  //     }
  //   }
  // }
  // error=false;


  UserForm: any =  FormGroup;

  prductMasterObj = {
    productCategoryId: null,
    name: "",
    description: "",
    uomId: null,
    productModelId: null,
    productTypeId: null,
    cost: "",
    purchaseVendorId: null,
    purchaseLink: "",
    returnable: "N",
    maintenanceRequired: "N",
    productStatusId: 1,
    remarks: ""
  }


  ngOnInit() {
    this.UserForm = this.fb.group({
      'productCategoryId': new FormControl(''),
      'name': new FormControl(''),
      'description': new FormControl(''),
      'uomId': new FormControl(''),
      'productModelId': new FormControl(''),
      'productTypeId': new FormControl(''),
      'cost': new FormControl(''),
      'purchaseVendorId': new FormControl(''),
      'purchaseLink': new FormControl(''),
      'returnable': new FormControl(''),
      'maintenanceRequired': new FormControl(''),
      // 'productStatusId': new FormControl(''),
      'remarks': new FormControl('')
    });
  }

  closeAddUser() {
    this.newItemEvent.emit(false);
  }

  openAnotherForm(newform:any) {
    this.newItemEvent.emit(false);
    localStorage.setItem('opennewform', newform)
  }

  submitted!: boolean;

  addInventory0: any;
  addInventory1: any;
  addInventory2: any;
  submit() {
    // console.log(this.prductMasterObj);
    if(this.UserForm.valid) {
      this.addInventory2 = Swal.fire({
        text: "Please wait",
        imageUrl: "assets/gif/ajax-loading-gif.gif",
        showConfirmButton: false,
        allowOutsideClick: false
      });
      this.productMasterSer.addingproduct(this.prductMasterObj).subscribe((res: any) => {
        // console.log(res);

        if(res) {
          this.addInventory1 = Swal.fire({
            icon: 'success',
            title: 'Done!',
            text: `${res.message}`,
          });
        }
      }, (err: any) => {
        if(err) {
          this.addInventory0 = Swal.fire({
            icon: 'warning',
            title: 'Failed!',
            text: 'Creating Inventory failed',
            // timer: 3000,
          });
        };
      })
    }
  }


  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }

}
