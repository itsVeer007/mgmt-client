import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { InventoryService } from 'src/services/inventory.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-new-inventory',
  templateUrl: './add-new-inventory.component.html',
  styleUrls: ['./add-new-inventory.component.css'],
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
export class AddNewInventoryComponent implements OnInit {
  constructor(private router: Router, private inventorySer: InventoryService, private apiser: ApiService, private fb: FormBuilder) { }

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

  x = {
    inv: {
      productSerialNo: "",
      productName: "",
      productBrand: "",
      productCategory: "",
      details: "",
      status: "Installed",
      cost: null,
      price: null
    },
    warr: {
        warrantyStartDate: "",
        warrantyEndDate: "",
        vendor: "",
        remarks: ""
    }
  }

  // email: string = "";

  ngOnInit() {
    this.UserForm = this.fb.group({
      'productSerialNo': new FormControl('', Validators.required),
      'productName': new FormControl('', Validators.required),
      'productBrand': new FormControl('', Validators.required),
      'productCategory': new FormControl('', Validators.required),
      // 'status': new FormControl(''),
      'cost': new FormControl(''),
      'price': new FormControl(''),
      'warrantyStartDate': new FormControl(''),
      'warrantyEndDate': new FormControl(''),
      'vendor': new FormControl('', Validators.required),
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
    // console.log(this.x);
    if(this.UserForm.valid) {
      this.newItemEvent.emit(false);

      this.addInventory2 = Swal.fire({
        text: "Please wait",
        imageUrl: "assets/gif/ajax-loading-gif.gif",
        showConfirmButton: false,
        allowOutsideClick: false
      });
      this.inventorySer.createInventory(this.x).subscribe((res: any) => {
        // console.log(res);

        if(res) {
          this.addInventory1 = Swal.fire({
            icon: 'success',
            title: 'Done!',
            text: `${res.message}`,
          });
        }

        setTimeout(() => {
          window.location.reload();
        }, 3000);

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
