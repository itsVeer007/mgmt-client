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
    private router: Router,
    private inventorySer: InventoryService,
    private fb: FormBuilder,
    private metadataSer: MetadataService,
    public alertSer: AlertService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
  ) { }

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<any>();

  // @Output() newUser = new EventEmitter<any>();

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
    inventory: {
      name: null,
      itemCode: null,
      brand: null,
      model: null,
      department: null,
      createdBy: 1,
      remarks: null
    },

    quantity: null,
    serialnos: '',

    warranty: {
      startDate: null,
      endDate: null,
      createdBy: 1,
      remarks: null
    }
  }

  // email: string = "";

  productData: any;
  orderIds: any;
  ngOnInit() {
    this.UserForm = this.fb.group({
      'name': new FormControl('', Validators.required),
      'itemCode': new FormControl('', Validators.required),
      'brand': new FormControl('', Validators.required),
      'model': new FormControl('', Validators.required),
      'department': new FormControl('', Validators.required),
      'remarks': new FormControl(''),

      'quantity': new FormControl('', Validators.required),
      'serialnos': new FormControl(''),

      'wremarks': new FormControl(''),
      'startDate': new FormControl(''),
      'endDate': new FormControl(''),

      'warrantyDetail': new FormControl(''),

      // 'partType': new FormControl(''),
      // 'partCategory': new FormControl(''),
      // 'partCode': new FormControl(''),
      // 'buildType': new FormControl('')
    });

    this.listProduct();
    this.onMetadataChange();
  }

  listProduct() {
    this.inventorySer.listProduct().subscribe((res: any) => {
      this.productData = res;
      // console.log(this.productData);
    })

    // this.inventorySer.listOrders().subscribe((res: any) => {
    //   this.orderIds = res;
    // })
  }


  // itemCode: any = null;
  // brand: any = null;
  // model: any = null;
  // name: any = null;

  // itemCodeBody = {
  //   partType: null,
  //   partCategory: null,
  //   partCode: null,
  //   buildType: null
  // }



  // listItemCode() {
  //   this.inventorySer.listItemCode(this.itemCodeBody).subscribe((res: any) => {
  //     // console.log(res);
  //     this.itemCode = res?.code;
  //     if(res?.code == null) {
  //       Swal.fire({
  //         icon: 'warning',
  //         title: 'No data!',
  //         text: 'Please add data in product master',
  //       })
  //     } else if(res?.code != null) {
  //       let itemBrandBody = {
  //         itemCode: res?.code,
  //         brand: null
  //       }

  //       this.inventorySer.listBrandAndModel(itemBrandBody).subscribe((res: any) => {
  //         this.brand = res?.brand;
  //       });

  //       this.inventorySer.listInventoryByItemCode(itemBrandBody).subscribe((res: any) => {
  //         this.name = res;
  //       })
  //     }
  //   })
  // }

  itemCodes: any;
  getItemCode(data: any) {
    this.inventorySer.getItemCode(data).subscribe((res: any) => {
      // this.model = res?.model;
      // console.log(res);
      this.itemCodes = res;
    })
  }

  brandNames: any = [];
  listInventoryByItemCode(data: any) {
    this.inventorySer.listInventoryByItemCode(data).subscribe((res: any) => {
      // this.model = res?.model;
      // console.log(res);
      this.brandNames = res;
    })
  }

  modelNames: any;
  listBrandAndModel(data: any) {
    // console.log(data)
    // this.inventorySer.listBrandAndModel(data).subscribe((res: any) => {
    //   console.log(res);
    //   this.modelNames = res?.brand;
    // })

    this.modelNames = data
  }

  filteredBrandNames: any;
  removeDuplicates() {
    this.filteredBrandNames = this.brandNames.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.productBrand == current.productBrand);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    // console.log(this.filteredBrandNames)
  }

  partType: any;
  partCategory: any;
  partCode: any;
  buildType: any;
  onMetadataChange() {
    this.metadataSer.getMetadata().subscribe((res: any) => {
      for(let item of res) {
        if(item.type == 'part_type') {
          this.partType = item.metadata;
        } else if(item.type == 'part_category') {
          this.partCategory = item.metadata;
        } else if(item.type == 'part_code') {
          this.partCode = item.metadata;
        } else if(item.type == 'build_type') {
          this.buildType = item.metadata;
        }
      }
    })
  }

  closeAddUser() {
    this.newItemEvent.emit();
  }

  openAnotherForm(newform:any) {
    this.newItemEvent.emit();
    localStorage.setItem('opennewform', newform)
  }

  submitted!: boolean;
  arr: any = [];
  warrantyDetail: any = 'N';
  submit() {
    this.inventoryBody.inventory.name = this.inventoryBody.inventory.itemCode;
    if(this.UserForm.valid) {
      this.alertSer.wait();
      if(this.inventoryBody.serialnos == '') {
        this.inventoryBody.serialnos = this.arr;
      } else {
        // this.inventoryBody.serialnos = this.inventoryBody.serialnos?.split(',').map((value: any) => value.trim());
        this.arr.push(this.inventoryBody.serialnos?.split(',').map((value: any) => value.trim()));
        this.inventoryBody.serialnos = this.arr[0];
      }
      this.inventoryBody.warranty.startDate = this.datepipe.transform(this.inventoryBody.warranty.startDate, 'yyyy-MM-dd');
      this.inventoryBody.warranty.endDate = this.datepipe.transform(this.inventoryBody.warranty.endDate, 'yyyy-MM-dd');

      this.inventorySer.createInventory(this.inventoryBody, this.warrantyDetail).subscribe((res: any) => {
        // console.log(res);
        this.newItemEvent.emit();
        this.alertSer.success(res?.message);
      }, (err: any) => {
        if(err) {
          this.alertSer.error(err?.error?.message);
        }
      });
    }
    // console.log(this.inventoryBody);
  }


  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }
}