import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';

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

  constructor(
    private inventorySer: InventoryService,
    private router: Router,
    private fb: FormBuilder,
    private metadataSer: MetadataService,
    public alertSer: AlertService
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

  prductMasterObj = {
    // categoryId: null,
    // typeId: null,
    // name: null,
    // uomId: null,
    // cost: null,
    // vendorId: null,
    // createdBy: 1,

    // model: null,
    // description: null,
    // returnable: "N",
    // maintenanceRequired: "N",
    // purchaseLink: null,
    // remarks: null

    materialDescription: null,
    uomId: null,
    partType: null,
    partCategory: null,
    partCode: null,
    buildType: null
  }


  ngOnInit() {
    this.UserForm = this.fb.group({
      // 'categoryId': new FormControl('', Validators.required),
      // 'typeId': new FormControl('', Validators.required),
      // 'name': new FormControl('', Validators.required),
      // 'uomId': new FormControl('', Validators.required),
      // 'cost': new FormControl('', Validators.required),
      // 'vendorId': new FormControl('', Validators.required),

      // 'model': new FormControl(''),
      // 'description': new FormControl(''),
      // 'returnable': new FormControl(''),
      // 'maintenanceRequired': new FormControl(''),
      // 'purchaseLink': new FormControl(''),
      // 'remarks': new FormControl('')

      'materialDescription': new FormControl('', Validators.required),
      'uomId': new FormControl('' , Validators.required),
      'partType': new FormControl('' , Validators.required),
      'partCategory': new FormControl('', Validators.required),
      'partCode': new FormControl('' , Validators.required),
      'buildType': new FormControl('', Validators.required)
    });

    this.ongetDeviceMode();
    // this.getVendor();
  }

  vendorDetail: any;
  getVendor() {
    this.inventorySer.listVendors().subscribe((res: any) => {
      this.vendorDetail = res;
    })
  }

  /* metadata filter */
  productCategory: any;
  productType: any;
  uomId: any;
  partType: any;
  partCode: any;
  partCategory: any;
  buildType: any;
  ongetDeviceMode() {
    this.metadataSer.getMetadata().subscribe((res: any) => {
      for(let item of res) {
        if(item.type == 'Product_Category') {
          this.productCategory = item.metadata;
        } else if(item.type == 'Product_Type') {
          this.productType = item.metadata;
        } else if(item.type == 'uom') {
          this.uomId = item.metadata;
        } else if(item.type == 'part_type') {
          this.partType = item.metadata;
        } else if(item.type == 'part_code') {
          this.partCode = item.metadata;
        } else if(item.type == 'part_category') {
          this.partCategory = item.metadata;
        } else if(item.type == 'build_type') {
          this.buildType = item.metadata;
        }
      }
    })
  }

  newType: any
  filterProductType(data: any) {
    this.newType = this.productType.filter((item: any) => {
      let x = item.keyId.toString();
      return Number(x.substring(0, x.length - 2)) == data;
    });
  }

  closeAddUser() {
    this.newItemEvent.emit();
  }

  submit() {
    if(this.UserForm.valid) {
      this.alertSer.wait();
      this.inventorySer.addingproduct(this.prductMasterObj).subscribe((res: any) => {
        // console.log(res);
        this.newItemEvent.emit();
        this.alertSer.success(res?.message);
      }, (err: any) => {
        if(err) {
          this.alertSer.error(err?.error?.message);
        };
      })
    }
    // console.log(this.prductMasterObj);
  }


  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }

}
