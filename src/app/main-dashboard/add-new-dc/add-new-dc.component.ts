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
export class AddNewDcComponent {

  constructor(
    private inventorySer: InventoryService,
    private fb: FormBuilder,
    public alertSer: AlertService,
    public datepipe: DatePipe
  ) { }

  @Input() show: any;
  @Output() newItemEvent = new EventEmitter<boolean>();


  UserForm: any =  FormGroup;

  inventoryBody = {
    name: null,
    address:null,
    state:null,
    code:null,
    createdBy: 1,
    itemCode: [
      {
        itemCode: null,
        descriptionOfGoods:null
      }
    ]
  }

  items: any = [];
  onTaskAdd(item: any) {
    // console.log(item);
    if(item?.itemCode == null) {
      this.alertSer.error('Please fill all fields');
    } else {
      let takBody = {
        'itemCode': item.itemCode,
        'descriptionOfGoods': item.descriptionOfGoods,
      }
      this.items.push(takBody);

      // this.UserForm.get('name').setValue(null);
      // this.UserForm.get('itemCode').setValue(null);
      // this.UserForm.get('address').setValue(null);
      // this.UserForm.get('state').setValue(null);
      // this.UserForm.get('code').setValue(null);
    }
    // console.log(this.items)
  }

  ngOnInit() {
    this.UserForm = this.fb.group({
      'name': new FormControl('', Validators.required),
      'itemCode': new FormControl('', Validators.required),
      'address': new FormControl('', Validators.required),
      'state': new FormControl('', Validators.required),
      'code': new FormControl('', Validators.required),
      'descriptionOfGoods':new FormControl('', Validators.required)
    });

    // this.getVendor();
    this.getProducts();
    // console.log(this.show);

  }

  productIds: any;
  getProducts() {
    let statusId = null;
    if(this.show == 'dc1') {
      statusId = 2
    }
    else {
      statusId = 5
    }
    this.inventorySer.listFRItems(1565, statusId).subscribe((res: any) => {
      this.productIds = res;
      console.log(res);
    })
  }

  closeIndent() {
    this.newItemEvent.emit();
  }

  warrantyDetail: any = 'No';
  submit() { 
    if(this.UserForm.valid) {
      if(this.items.length > 0) {
        this.alertSer.wait();
        this.inventoryBody.itemCode = this.items;
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
    console.log(this.inventoryBody);
  }

  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }

}
