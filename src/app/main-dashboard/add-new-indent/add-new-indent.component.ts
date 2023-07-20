import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { IndentService } from 'src/services/indent.service';
import { InventoryService } from 'src/services/inventory.service';
import { OrderService } from 'src/services/order.service';
import { ProductMasterService } from 'src/services/product-master.service';
import { VendorsService } from 'src/services/vendors.service';

@Component({
  selector: 'app-add-new-indent',
  templateUrl: './add-new-indent.component.html',
  styleUrls: ['./add-new-indent.component.css'],
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
export class AddNewIndentComponent implements OnInit {
  constructor(
    private router: Router,
    private productSer: ProductMasterService,
    private indentSer: IndentService,
    private vendorSer: VendorsService,
    private fb: FormBuilder,

    public alertSer: AlertService,
    public datepipe: DatePipe
  ) { }

  @Input() show:any;
  @Output() newItemEvent = new EventEmitter<any>();

  UserForm: any =  FormGroup;

  inventoryBody = {
    jobOrTicketId: null,
    createdBy: 1,
    items: [
      {
        productId: null,
        quantity: null
      }
    ],
    remarks: null
  }

  ngOnInit() {
    this.UserForm = this.fb.group({
      'jobOrTicketId': new FormControl('', Validators.required),
      'productId': new FormControl(''),
      'quantity': new FormControl(''),
      'remarks': new FormControl('')
    });

    this.getVendor();
  }

  items: any = [];
  onTaskAdd(item: any) {
    let takBody = {
      'productId': item.productId,
      'quantity': item.quantity
    }

    this.items.push(takBody);
  }

  vendorDetail: any;
  productIds: any
  getVendor() {
    this.vendorSer.listVendors().subscribe((res: any) => {
      // console.log(res);
      this.vendorDetail = res;
    })

    this.productSer.list().subscribe((res: any) => {
      this.productIds = res;
    })
  }

  closeAddUser() {
    this.newItemEvent.emit(false);
  }

  openAnotherForm(newform:any) {
    this.newItemEvent.emit(false);
    localStorage.setItem('opennewform', newform)
  }

  submitted!: boolean;
  arr: any = [];
  warrantyDetail: any = 'No';
  submit() {
    // console.log(this.inventoryBody);
    // console.log(this.warrantyDetail);
    setTimeout(() => {
      this.newItemEvent.emit();
    }, 3000)

    this.inventoryBody.items = this.items;
    if(this.UserForm.valid) {
      this.alertSer.wait();
      this.newItemEvent.emit(false);
      this.indentSer.createIndent(this.inventoryBody).subscribe((res: any) => {
        // console.log(res);
        if(res) {
          this.alertSer.success(res);
        }
        setTimeout(() => {
          // window.location.reload();
        }, 3000);
      }, (err: any) => {
        if(err) {
          this.alertSer.error();
        }
      });
    }
  }


  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }

}
