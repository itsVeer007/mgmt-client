import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';

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
    private inventorySer: InventoryService,
    private router: Router,
    private fb: FormBuilder,
    public alertSer: AlertService,
    public datepipe: DatePipe
  ) { }

  @Input() show: any;
  // @Input() ticketIdFrmFr: any;
  @Output() newItemEvent = new EventEmitter<any>();

  UserForm: any =  FormGroup;

  inventoryBody = {
    ticketId: null,
    createdBy: 1,
    items: [
      {
        itemCode: null,
        quantity: null
      }
    ],
    remarks: null
  }

  ticketIdFrmFr: any;
  ngOnInit() {
    this.UserForm = this.fb.group({
      'jobOrTicketId': new FormControl(''),
      'productId': new FormControl('', Validators.required),
      'quantity': new FormControl(''),
      'remarks': new FormControl('')
    });

    this.getVendor();
    this.ticketIdFrmFr = JSON.parse(localStorage.getItem('ticketId')!);
  }

  items: any = [];
  onTaskAdd(item: any) {
    let takBody = {
      'itemCode': item.itemCode,
      'quantity': item.quantity
    }

    this.items.push(takBody);
  }

  vendorDetail: any;
  productIds: any
  getVendor() {
    this.inventorySer.listVendors().subscribe((res: any) => {
      // console.log(res);
      this.vendorDetail = res;
    })

    this.inventorySer.listProduct().subscribe((res: any) => {
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

    if(this.UserForm.valid) {
      this.alertSer.wait();
      this.newItemEvent.emit(false);
      this.inventoryBody.ticketId = this.ticketIdFrmFr?.id;
      this.inventoryBody.items = this.items;
      this.inventorySer.createIndent(this.inventoryBody).subscribe((res: any) => {
        // console.log(res);
        if(res) {
          this.alertSer.success(res);
        }
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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
