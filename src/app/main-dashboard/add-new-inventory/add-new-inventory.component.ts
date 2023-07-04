import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
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
  constructor(
    private router: Router,
    private inventorySer: InventoryService,
    private apiser: ApiService,
    private alertSer: AlertService,
    private fb: FormBuilder,
    public datepipe: DatePipe
  ) { }

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

  inventoryBody = {
    inv: {
      productId: null,
      orderId: null,
      quantity: null,
      serialNo: '',
      cost: null,
      price: null,
      // statusId: 1,
      createdBy: 1,
      remarks: ''
    },
    warr: {
      serialNo: "",
      newSerialNo: "",
      cost: "",
      vendor: "",
      startDate: null,
      endDate: null,
      // statusId: 1,
      createdBy: 1,
      remarks: ""
    }
  }

  // email: string = "";

  ngOnInit() {
    this.UserForm = this.fb.group({
      'productId': new FormControl('', Validators.required),
      'orderId': new FormControl('', Validators.required),
      'quantity': new FormControl(''),
      'serialNo': new FormControl(''),
      'cost': new FormControl('', Validators.required),
      'price': new FormControl('', Validators.required),
      'remarks': new FormControl(''),


      'wserialNo': new FormControl(''),
      'wnewSerialNo': new FormControl(''),
      'wcost': new FormControl(''),
      'vendor': new FormControl(''),
      'startDate': new FormControl(''),
      'endDate': new FormControl(''),
      'wremarks': new FormControl(''),
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

  // addInventory0: any;
  // addInventory1: any;
  // addInventory2: any;
  submit() {
    // console.log(this.inventoryBody);
    this.inventoryBody.warr.startDate = this.datepipe.transform(this.inventoryBody.warr.startDate, 'yyyy-MM-dd');
    this.inventoryBody.warr.endDate = this.datepipe.transform(this.inventoryBody.warr.endDate, 'yyyy-MM-dd');
    if(this.UserForm.valid) {
      this.newItemEvent.emit(false);

      // this.addInventory2 = Swal.fire({
      //   text: "Please wait",
      //   imageUrl: "assets/gif/ajax-loading-gif.gif",
      //   showConfirmButton: false,
      //   allowOutsideClick: false
      // });
      this.alertSer.wait();

      this.inventorySer.createInventory(this.inventoryBody).subscribe((res: any) => {
        // console.log(res);

        if(res) {
          // this.addInventory1 = Swal.fire({
          //   icon: 'success',
          //   title: 'Done!',
          //   text: `${res.message}`,
          // });
          this.alertSer.success(res);
        }
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      },
      (err: any) => {
        if(err) {
          // this.addInventory0 = Swal.fire({
          //   icon: 'warning',
          //   title: 'Failed!',
          //   text: 'Creating Inventory failed',
          // });
          this.alertSer.error();
        };
      })
    }
  }


  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }

}
