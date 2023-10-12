import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DcChallanComponent } from 'src/app/utilities/dc-challan/dc-challan.component';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';

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
    private alertSer: AlertService,
    private dialog: MatDialog,
    public datepipe: DatePipe
  ) { }

  @Input() show: any;
  @Output() newItemEvent = new EventEmitter<boolean>();


  UserForm: any =  FormGroup;

  inventoryBody = {
    name: null,
    address: null,
    state: null,
    code: null,
    createdBy: 1,
    itemCode: [
      {
        itemCode: null,
        descriptionOfGoods: null,
        quantity: null,
      }
    ]
  }

  ngOnInit() {
    this.UserForm = this.fb.group({
      'name': new FormControl(''),
      'itemCode': new FormControl(''),
      'address': new FormControl(''),
      'state': new FormControl(''),
      'code': new FormControl(''),
      'descriptionOfGoods':new FormControl(''),
      'quantity':new FormControl('')
    });

    // this.getVendor();
    this.getProducts();
  }

  items: any = [];
  onTaskAdd(item: any) {
    if(item?.descriptionOfGoods == null && item?.quantity == null &&  item?.itemCode == null) {
      this.alertSer.error('Please fill all fields');
    } else {
      let takBody = {
        'itemCode': item.itemCode,
        'descriptionOfGoods': item.descriptionOfGoods,
        'quantity':item.quantity
      }
      this.items.push(takBody);
      this.UserForm.get('itemCode').setValue(null);
      this.UserForm.get('descriptionOfGoods').setValue(null);
      this.UserForm.get('quantity').setValue(null)
    }
    // console.log(this.items)
  }

  productIds: any;
  getProducts() {
    let statusId = null;
    // let frId = null;
    // if(this.show == 'fromInventory') {
    //   statusId = 2
    //   frId = 1565
    // } else {
    //   statusId = 5
    //   frId = 1565
    // }
    this.show == 'fromInventory' ? statusId = 2 : statusId = 5;
    this.inventorySer.listFRItems(1565, statusId).subscribe((res: any) => {
      // console.log(res)
      this.productIds = res;
    })
  }

  closeIndent() {
    this.newItemEvent.emit();
  }

  currentItemCode: any;
  getItemCode(name: any) {
    this.inventorySer.getItemCode(name).subscribe((res: any) => {
      // console.log(res)
      this.currentItemCode = res
    })
  }



  listQuantityBody = {
    itemCode: null,
    modifiedBy:1565,
    statusId:5
  }

  // inventoryQty: any;
  // listQuantity() {
  //   this.listQuantityBody.itemCode = this.currentItemCode?.code;
  //   this.inventorySer.listQuantity(this.listQuantityBody).subscribe((res:any)=> {
  //     // console.log(res);
  //     this.inventoryQty = res;
  //   })
  // }


  warrantyDetail: any = 'No';
  submit() { 
    if(this.UserForm.valid) {
      if(this.items.length > 0) {
        // this.alertSer.wait();
        this.inventoryBody.itemCode = this.items;
        localStorage.setItem('dcItems', JSON.stringify(this.items))
        this.inventorySer.createDC(this.inventoryBody).subscribe((res: any) => {
          // console.log(res);
          this.newItemEvent.emit();
          this.alertSer.snackSuccess(res?.message);
          this.dialog.open(DcChallanComponent);
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
