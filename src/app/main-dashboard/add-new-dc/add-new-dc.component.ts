import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';

@Component({
  selector: 'app-add-new-dc',
  templateUrl: './add-new-dc.component.html',
  styleUrls: ['./add-new-dc.component.css'],
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
export class AddNewDcComponent implements OnInit {

  constructor(
    private inventorySer: InventoryService,
    private router: Router,
    private fb: FormBuilder,
    public alertSer: AlertService,
    public datepipe: DatePipe
  ) { }

  @Input() show: any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  UserForm: any =  FormGroup;

  inventoryBody = {
    items: [
      {
        name: null,
        // descriptionOfGoods: null,
        itemCode: null,
        address:null,
        state:null,
        code:null,
        createdBy: 1
      }
    ]
  }

  items: any = [];
  onTaskAdd(item: any) {
    // console.log(item);
    if(item?.name == null || item?.itemCode == null) {
      this.alertSer.error('Please fill all fields');
    } else {
      let takBody = {
        'name': item.name,
        'itemCode': item.itemCode,
        'address': item.address,
        'state': item.state,
        'code': item.code
      }
      this.items.push(takBody);
      this.UserForm.get('name').setValue(null);
      this.UserForm.get('descriptionOfGoods').setValue(null);
      this.UserForm.get('address').setValue(null);
      this.UserForm.get('state').setValue(null);
      this.UserForm.get('code').setValue(null);
    }
  }

  ticketIdFrmFr: any;
  ngOnInit() {
    this.UserForm = this.fb.group({
      'name': new FormControl(''),
      'descriptionOfGoods': new FormControl(''),
      'address': new FormControl(''),
      'state': new FormControl(''),
      'code': new FormControl('')
    });

    // this.getVendor();
    this.getProducts();
    this.ticketIdFrmFr = JSON.parse(localStorage.getItem('ticketId')!);
  }

  vendorDetail: any;
  getVendor() {
    this.inventorySer.listVendors().subscribe((res: any) => {
      this.vendorDetail = res;
    })
  }

  productIds: any;
  getProducts() {
    this.inventorySer.listFRItems(1565, 5).subscribe((res: any) => {
      this.productIds = res;
    })
  }

  closeIndent() {
    this.newItemEvent.emit();
  }

  submitted!: boolean;
  arr: any = [];
  warrantyDetail: any = 'No';
  submit() { 
    if(this.UserForm.valid) {
      if(this.items.length > 0) {
        this.alertSer.wait();
        this.inventoryBody.items = this.items;
        // this.inventoryBody.items[0].itemCode = this.inventoryBody.items[0].descriptionOfGoods;
        this.inventorySer.createDC(this.inventoryBody).subscribe((res: any) => {
          // console.log(res);
          this.newItemEvent.emit();
          this.alertSer.success(res?.message);
        }, (err: any) => {
          if(err) {
            this.alertSer.error(err?.error?.message);
          }
        });
      } else {
        this.alertSer.error('Please add atleast one task')
      }
    }
  }


  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }

}
